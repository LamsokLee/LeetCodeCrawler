var request = require('request');
var LeetCode = require('./database');
var config = require('../config/url');

// Get the problem list.
request(config.problem_list_ap, (error, response, body) => {
    if (error) {
        console.log("Error: " + error);
    }
    console.log("Status code: " + response.statusCode);
    if (response.statusCode === 200) {
        json = JSON.parse(body)['stat_status_pairs'];
        questions = {};
        for (i = 0; i < 3; i++) {
            stat = json[i]['stat'];
            id = stat['question_id'];
            options = {upsert: true};
            LeetCode.updateOne({ question_id : stat['question_id']}, {
                question__title : stat['question__title'],
                question__title_slug : stat['question__title'].replace(/[\(\,\')]/g,"").replace(/ /g,"-").replace(/-{2,}/, "-").toLowerCase(),
                total_acs : stat['total_acs'],
                total_submitted : stat['total_submitted'],
                difficulty : json[i]['difficulty']['level']
            }, options, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }
});




// request(url, (error, response, body) => {
//     if (error) {
//         console.log("Error: " + error);
//     }
//     console.log("Status code: " + response.statusCode);
//     if (response.statusCode === 200) {
//         console.log(body);
//         var $ = cheerio.load(body);
        
//     }
// });




// const puppeteer = require('puppeteer');

// (async () => {
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setViewport({
//         width: 1920,
//         height: 1080
//     });
//     await page.goto(problem);
//     console.log("go to")
    
//     await page.waitForSelector('#initial-loading', { hidden : true });

//     const likes = await page.evaluate(() => {
//         return document.querySelectorAll('.btn__r7r7')[0].querySelector('span').innerHTML;
//     });
//     console.log(likes);

//     const dislikes = await page.evaluate(() => {
//         return document.querySelectorAll('.btn__r7r7')[1].querySelector('span').innerHTML;
//     });
//     console.log(dislikes);

//     const accepted = await page.evaluate(() => {
//         var res = document.querySelectorAll('.css-jkjiwi')[0].innerText;
//         return res;
//     });
//     console.log(accepted);

//     const submitted = await page.evaluate(() => {
//         var res = document.querySelectorAll('.css-jkjiwi')[1].innerText;
//         return res;
//     });

//     console.log(submitted);

//     await page.screenshot({path:'example.png'});

//     await browser.close();

//   } catch (error) {
//     console.log(error);
//   }

// })();

// request(url, (error, response, body) => {
//     if (error) {
//         console.log("Error: " + error);
//     }
//     console.log("Status code: " + response.statusCode);
//     if (response.statusCode === 200) {
//         console.log(body);
//         var $ = cheerio.load(body);
        
//     }
// });




// request(problem, (error, response, body) => {
//     if (error) {
//         console.log("Error: " + error);
//     }
//     console.log("Status code: " + response.statusCode);
//     if (response.statusCode === 200) {
//         var $ = cheerio.load(body);

//     }
// });