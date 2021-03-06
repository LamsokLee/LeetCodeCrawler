const User = require('../schemas/User');
const urlConfig = require('../../config/url');
const config = require('../../config/config');
const logger = require('../logging');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const requestWithBackOff = require('./ExponentialBackoff');
var browser;

const getUserList = async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    var pageNum = 1;
    var user2Rank = {}
    var userList = [];

    while (true) {
        var page = await browser.newPage();
        try {
            logger.info('Fetching page: ' + pageNum);

            await page.goto(urlConfig.CONTEST_RANKING_BASE + pageNum, { timeout: config.REQUEST_TIMEOUT });
            await page.waitForSelector('.ranking-table');

            var content = await page.content();
            const $ = cheerio.load(content);

            var rows = $('.ranking-row');
            logger.info(rows.length + ' users loaded');
            if (rows.length == 0) {
                logger.info('Finished pulling user names: ' + userList.length + 'loaded.');
                break;
            }
            var requestPromises = [];
            rows.each((i, elem) => {
                rank = $('.ranking', elem).text();
                user = $('.username', elem).text();
                userPage = $('a', elem).attr('href');
                userList.push(user);
                user2Rank[user] = rank;
                requestPromises.push(getUserInfo(userPage));
            });
            await Promise.all(requestPromises);
            pageNum++;
        } catch (error) {
            logger.error(error.toString());
        } finally {
            page.close();
        }
    }
    browser.close();
}

const getUserInfoFromLeetcode = async (userPage) => {
    logger.verbose('Fetching user page: ' + userPage);
    var content;
    try {
        content = await requestWithBackOff(userPage, 10000, config.REQUEST_TIMEOUT);
    } catch (ex) {
        logger.error('Error loading user page ' + userPage + '. ' + ex);
        return;
    }

    try {
        const $ = cheerio.load(content);
        var userData = {};
        var str = $('.response-container').attr('ng-init').replace('pc.init', '')
        var json = ('[' + str.substring(1, str.length - 1) + ']').replace(/'/g, '"');
        var arr = JSON.parse(json);
        userData['contest_history'] = []
        if (arr[11]) {
            for (i = 0; i < arr[11].length; i++) {
                userData['contest_history'][i] = arr[11][i][0];
            }
        }

        var rows = $('.list-group-item').find('.pull-right');
        rows.each((i, elem) => {
            var key = $(elem.previousSibling).text().trim().toLowerCase();
            var val = $(elem).text().trim();
            userData[key] = val;
        });

        userData['user_page'] = userPage;
        userData['user_id'] = $('.username').text().trim();
        userData['real_name'] = $('.realname').text().trim();
        userData['contest_finished'] = $($('.list-group-item').find('.progress-bar-success').get(0)).text().trim();
        userData['contest_rating'] = $($('.list-group-item').find('.progress-bar-success').get(1)).text().trim();
        userData['contest_ranking'] = $($('.list-group-item').find('.progress-bar-success').get(2)).text().trim().split('/')[0].trim();
        userData['progress_solved'] = $($('.list-group-item').find('.progress-bar-success').get(3)).text().trim().split('/')[0].trim();
        userData['progress_accepted'] = $($('.list-group-item').find('.progress-bar-success').get(4)).text().trim().split('/')[0].trim();
        userData['progress_submitted'] = $($('.list-group-item').find('.progress-bar-success').get(4)).text().trim().split('/')[1].trim();
        userData['progress_acceptance_rate'] = $($('.list-group-item').find('.progress-bar-info').get(0)).text().trim().replace('%', '');
        userData['contribution_points'] = $($('.list-group-item').find('.progress-bar-success').get(5)).text().trim();
        userData['contribution_problems'] = $($('.list-group-item').find('.progress-bar-success').get(6)).text().trim();
        userData['contribution_test_cases'] = $($('.list-group-item').find('.progress-bar-success').get(7)).text().trim();
    } catch (ex) {
        logger.error('Error parsing user data ' + userPage + ' ' + ex);
    }
    logger.info('User data loaded: ' + userData['user_id']);

    return userData;
}

const getUserInfoFromLeetcodeCN = async (userPage) => {
    var page;
    logger.info('Fetching page: ' + userPage);
    try {
        page = await browser.newPage();
        await page.goto(userPage, { timeout: config.REQUEST_TIMEOUT });
        await page.waitForSelector('.css-iy4pb-Container');
        var content = await page.content();
    } catch (ex) {
        logger.error('Error loading user page ' + userPage + '. ' + ex);
    } finally {
        page.close();
    }
    
    if (content == null) {
        return;
    }

    try {
        const $ = cheerio.load(content);
        var userData = {};
        userData['user_page'] = userPage;
        userData['user_id'] = $('.css-xe07el-UserSlug').text().trim()
        userData['real_name'] = $('.css-lx5wgw-UserName').text().trim()
        userData['location'] = 'China';
        userData['contest_finished'] = $($('.css-3wuwj3-SectionTitle').get(5)).text().replace(/\D/g, '');
        userData['contest_ranking'] = $($('.css-16qbhuy-RankValue').get(1)).text();
        userData['contest_ranking_china'] = $($('.css-16qbhuy-RankValue').get(0)).text();
        userData['progress_solved'] = $($('.css-1wo8881-ProgressNumber').get(0)).text().split('/')[0];
        userData['progress_accepted'] = $($('.css-1wo8881-ProgressNumber').get(1)).text().split('/')[0];
        userData['progress_submitted'] = $($('.css-1wo8881-ProgressNumber').get(1)).text().split('/')[1];
        userData['progress_acceptance_rate'] = $($('.css-1wo8881-ProgressNumber').get(2)).text().replace('%', '');
    } catch (ex) {
        logger.error('Error parsing user data ' + userPage + ' ' + ex);
        return;
    } 

    logger.info('User data loaded: ' + userData['user_id']);
    return userData;
}

const updateUserToDatabase = async (userData) => {
    if (userData == null) {
        return;
    }

    User.updateOne({ user_id: userData['user_id'] }, {
        real_name: userData['real_name'],
        userPage: userData['userPage'],
        location: userData['location'],
        company: userData['company'],
        school: userData['school'],
        contest_finished: userData['contest_finished'],
        contest_rating: userData['contest_rating'],
        contest_ranking: userData['contest_ranking'],
        contest_ranking_china: userData['contest_ranking_china'],
        progress_solved: userData['progress_solved'],
        progress_accepted: userData['progress_accepted'],
        progress_submitted: userData['progress_submitted'],
        progress_acceptance_rate: userData['progress_acceptance_rate'],
        contribution_points: userData['contribution_points'],
        contribution_problems: userData['contribution_problems'],
        contribution_test_cases: userData['contribution_test_cases'],
        contest_history: userData['contest_history'],
        last_updated: Date.now()
    }, { upsert: true }, (err) => {
        if (err) {
            logger.error(err.toString());
        }
    });
    logger.info('User data updated to database: ' + userData['user_id']);
}

const getUserInfo = async (userPage) => {
    var userData;
    if (userPage.startsWith(urlConfig.LEETCODE_CN_BASE)) {
        userData = await getUserInfoFromLeetcodeCN(userPage);
    } else {
        userData = await getUserInfoFromLeetcode(urlConfig.USER_BASE + userPage);
    }
    await updateUserToDatabase(userData);
}

if (process.env.NODE_ENV == 'production') {
    logger.info('Production mode');
    schedule.scheduleJob('0 5 4 * *', () => {
        logger.info('Start updating database');
        start();
        logger.info('Finished updating database');
    });
} else {
    logger.info('Development mode');
    getUserList();
}