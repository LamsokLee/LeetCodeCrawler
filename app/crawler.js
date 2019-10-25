const request = require('request-promise');
const Problem = require('./database');
const config = require('../config/url');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const logger = require('./logging');
var browser;


const start = async () => {
    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        result = await request(config.problem_list_api);
        json = JSON.parse(result);
        logger.info("Problem list loaded: " + json['stat_status_pairs'].length + " problems");
        await updateDataBase(json);
        await browser.close();
    } catch (e) {
        logger.error(e);
    }
}

const updateDataBase = async (json) => {
    for (i = 0; i < json['stat_status_pairs'].length; i++) {
        var problems = json['stat_status_pairs'];
        var stat = problems[i]['stat'];
        var id = stat['question_id'];
        if (!problems[i]['paid_only']) {
            var like_dislike = await getLikeAndDislikeCount(stat['question__title_slug']);
            stat['like_count'] = like_dislike[0];
            stat['dislike_count'] = like_dislike[1];
        } else {
            logger.info('Problem is paid only: ' + stat['question__title_slug']);
        }

        var options = { upsert: true };

        Problem.updateOne({ question_id: stat['question_id'] }, {
            question__title: stat['question__title'],
            question__title_slug: stat['question__title_slug'],
            total_acs: stat['total_acs'],
            total_submitted: stat['total_submitted'],
            difficulty: problems[i]['difficulty']['level'],
            like_count: stat['like_count'],
            dislike_count: stat['dislike_count'],
            last_update : Date.now()
        }, options, (err) => {
            if (err) {
                console.error(err);
            }
        });
        logger.info('Question updated: ' + id);
    }
}

const getLikeAndDislikeCount = async (question_title) => {
    logger.info('Opening problem page: ' + question_title);
    const page = await browser.newPage();
    try {
        problem_url = config.problem_base + question_title;
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        await page.goto(problem_url);

        await page.waitForSelector('#initial-loading', { hidden: true });

        var likes = await page.evaluate(() => {
            return document.querySelectorAll('.btn__r7r7')[0].querySelector('span').innerHTML;
        });

        var dislikes = await page.evaluate(() => {
            return document.querySelectorAll('.btn__r7r7')[1].querySelector('span').innerHTML;
        });
        logger.info("likes: " + likes + " dislikes: " + dislikes);
    } catch (error) {
        console.error(error);
    } finally {
        page.close();
    }
    return [likes, dislikes];
};

schedule.scheduleJob('0 5 * * *', () => {
    logger.info('Start pulling data');
    start();
});
