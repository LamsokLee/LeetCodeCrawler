const request = require('request-promise');
const Problem = require('./schemas/Problem');
const config = require('../config/keys');
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
        logger.error(e.toString());
    }
}

const updateDataBase = async (json) => {
    for (i = 0; i < json['stat_status_pairs'].length; i++) {
        problems = json['stat_status_pairs'];
        stat = problems[i]['stat'];
        logger.info('Updating problem: ' + stat['question__title']);
        id = stat['question_id'];
        total_submission_and_accept = stat['total_submitted'] + stat['total_acs'];
        stat['acceptance_rate'] = total_submission_and_accept == 0 ? 0 : stat['total_acs'] / total_submission_and_accept;
        if (!problems[i]['paid_only']) {
            var like_dislike = await getLikeAndDislikeCount(stat['question__title_slug']);
            stat['like_count'] = like_dislike[0];
            stat['dislike_count'] = like_dislike[1];
            total_like_and_unlikes = stat['like_count'] + stat['dislike_count'];
            stat['like_rate'] = total_like_and_unlikes == 0 ? 0 : stat['like_count'] / total_like_and_unlikes;
        } else {
            logger.info('Problem is paid only: ' + stat['question__title_slug']);
        }

        Problem.updateOne({ question_id: stat['question_id'] }, {
            frontend_id : stat['frontend_question_id'],
            question__title: stat['question__title'],
            question__title_slug: stat['question__title_slug'],
            total_acs: stat['total_acs'],
            total_submitted: stat['total_submitted'],
            acceptance_rate : stat['acceptance_rate'],
            difficulty: problems[i]['difficulty']['level'],
            like_count: stat['like_count'],
            dislike_count: stat['dislike_count'],
            like_rate: stat['like_rate'],
            last_update : Date.now()
        }, { upsert: true }, (err) => {
            if (err) {
                logger.error(err.toString());
            }
        });
    }
}

const getLikeAndDislikeCount = async (question_title) => {
    const page = await browser.newPage();
    try {
        problem_url = config.problem_base + question_title;
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        await page.goto(problem_url);

        await page.waitForSelector('#initial-loading', { hidden: true });

        likes = await page.evaluate(() => {
            return document.querySelectorAll('.btn__r7r7')[0].querySelector('span').innerHTML;
        });

        dislikes = await page.evaluate(() => {
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

