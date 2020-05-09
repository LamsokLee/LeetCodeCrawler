const request = require('request-promise');
const logger = require('../logging');


const requestWithBackOff = async (url, initDelay, maxDelay) => {
    var curDelay = initDelay;
    var tryNum = 1;
    var res;
    while (curDelay <= maxDelay) {
        try {
            res = await request(url);
        } catch (ex) {
            if (ex.statusCode == 429) {
                curDelay = curDelay * 2;
                var randomDelay = curDelay * (Math.random() + 1);
                logger.verbose('Error 429 when requesting ' + url + ' : Backoff ' + randomDelay + ' ms.')
                await sleep(randomDelay);
                tryNum++;
                continue;
            }
            if (ex.statusCode == 404) {
                throw ex;
            }
        }
        logger.info('Request resolved in ' + tryNum + ' tries. URL: ' + url);
        break;
    }
    return res;
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = requestWithBackOff;