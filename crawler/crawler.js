const request = require('request-promise');
const Problem = require('./database');
const config = require('../config/url');
const puppeteer = require('puppeteer');

const start = async() => {
    try {
        result = await request(config.problem_list_api);   
        json = JSON.parse(result);
        console.log("Problem list loaded: " + json['stat_status_pairs'].length + " problems");
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        await updateDataBase(json);
        await browser.close();
    } catch (e){
        console.log(e);
    }
}

const updateDataBase = async(json) => {
    for (i = 0; i < json['stat_status_pairs'].length; i++) {
        problems = json['stat_status_pairs'];
        stat = problems[i]['stat'];
        id = stat['question_id'];
        var like_dislike = await getLikeAndDislikeCount(stat['question__title_slug']);
        stat['like_count'] = like_dislike[0];
        stat['dislike_count'] = like_dislike[1];
        
        options = {upsert: true};
        
        Problem.updateOne({ question_id : stat['question_id']}, {
            question__title : stat['question__title'],
            question__title_slug : stat['question__title_slug'],
            total_acs : stat['total_acs'],
            total_submitted : stat['total_submitted'],
            difficulty : problems[i]['difficulty']['level'],
            like_count : stat['like_count'],
            dislike_count : stat['dislike_count']
        }, options, (err) => {
            if (err) {
                console.error(err);
            }
        });
        console.log('Question updated: ' + id);
    }
}

const getLikeAndDislikeCount = async(question_title) => {
    console.log('Opening problem page: ' + question_title);
    var likes;
    var dislikes;
    try {
    problem_url = config.problem_base + question_title;
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.goto(problem_url);
    
    await page.waitForSelector('#initial-loading', { hidden : true });

    likes = await page.evaluate(() => {
        return document.querySelectorAll('.btn__r7r7')[0].querySelector('span').innerHTML;
    });

    dislikes = await page.evaluate(() => {
        return document.querySelectorAll('.btn__r7r7')[1].querySelector('span').innerHTML;
    });
    console.log("likes: " + likes + " dislikes: " + dislikes);
  } catch (error) {
    console.log(error);
  }
  return [likes, dislikes];
};

start();