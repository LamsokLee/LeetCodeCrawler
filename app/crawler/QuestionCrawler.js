const Problem = require('../schemas/Problem');
const config = require('../../config/url');
const logger = require('../logging');
const request = require('request-promise');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

var browser;

const start = async () => {
    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        var result = await request(config.PROBLEM_LIST_API);
        var json = JSON.parse(result);
        logger.info('Problem list loaded: ' + json['stat_status_pairs'].length + ' problems');
        await updateDataBase(json);
        await browser.close();
    } catch (e) {
        logger.error(e.toString());
    }
}

const updateDataBase = async (json) => {
    for (i = 0; i < json['stat_status_pairs'].length; i++) {
        try {
            var problems = json['stat_status_pairs'];
            var stat = problems[i]['stat'];
            logger.info('Updating problem: ' + stat['question__title']);
            var totalSubmissionAndAccepted = stat['total_submitted'] + stat['total_acs'];
            stat['acceptance_rate'] = totalSubmissionAndAccepted == 0 ? 0 : stat['total_acs'] / totalSubmissionAndAccepted;
            if (!problems[i]['paid_only']) {
                var like_dislike = await getLikeAndDislikeCount(stat['question__title_slug']);
                stat['like_count'] = like_dislike[0];
                stat['dislike_count'] = like_dislike[1];
                total_like_and_unlikes = stat['like_count'] + stat['dislike_count'];
                stat['like_rate'] = total_like_and_unlikes == 0 ? 0 : stat['like_count'] / total_like_and_unlikes;
            } else {
                logger.info('Problem is paid only: ' + stat['question__title_slug']);
            }    
        } catch (ex) {
            logger.err('Error occurred updating problem ' + ex);
        }
        
        Problem.updateOne({ question_id: stat['question_id'] }, {
            frontend_id: stat['frontend_question_id'],
            question__title: stat['question__title'],
            question__title_slug: stat['question__title_slug'],
            total_acs: stat['total_acs'],
            total_submitted: stat['total_submitted'],
            acceptance_rate: stat['acceptance_rate'],
            difficulty: problems[i]['difficulty']['level'],
            like_count: stat['like_count'],
            dislike_count: stat['dislike_count'],
            like_rate: stat['like_rate'],
            last_update: Date.now()
        }, { upsert: true }, (err) => {
            if (err) {
                logger.error(err.toString());
            }
        });
    }
}

const getLikeAndDislikeCount = async (questionTitle) => {
    const page = await browser.newPage();
    try {
        var problemUrl = config.PROBLEM_BASE + questionTitle;
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        await page.goto(problemUrl);

        await page.waitForSelector('#initial-loading', { hidden: true });

        var likes = await page.evaluate(() => {
            return document.querySelectorAll('.btn__r7r7')[0].querySelector('span').innerHTML;
        });

        var dislikes = await page.evaluate(() => {
            return document.querySelectorAll('.btn__r7r7')[1].querySelector('span').innerHTML;
        });
    } catch (error) {
        logger.error(error.toString());
    } finally {
        page.close();
    }
    return [parseInt(likes), parseInt(dislikes)];
};

if (process.env.NODE_ENV == 'production') {
    logger.info('Production mode');
    schedule.scheduleJob('0 5 * * *', () => {
        logger.info('Start updating database');
        start();
        logger.info('Finished updating database');
    });
} else {
    logger.info('Development mode');
    start();
}