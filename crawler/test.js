var request = require('request-promise');
var config = require('../config/url');


const start = async () => {
    const res = await request(config.problem_list_api);
    console.log(res);
}

start();
// function sendRequest() {
//     res;
//     request(config.problem_list_api, (error, response, body) => {
//         if (error) {
//             console.log("Error: " + error);
//         }
//         if (response.statusCode === 200) {
//             // console.log(body);
//             console.log("get body");
//             // return body;
//             res = body;
//         }
//     });
//     console.log('request sent');
//     return res;
// }

// var res = sendRequest();
// console.log(res);
// var res = request(config.problem_list_api, (error, response, body) => {
//     if (error) {
//         console.log("Error: " + error);
//     }
//     if (response.statusCode === 200) {
//         // console.log(body);
//         console.log("get body");
//         return body;
//     }
// }).end();

// console.log("haha");
// console.log(res);