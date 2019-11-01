# LeetCode Crawler
[![Build Status](https://travis-ci.com/LamsokLee/LeetCodeCrawler.svg?branch=master)](https://travis-ci.com/LamsokLee/LeetCodeCrawler)


A web crawler that pulls question data from LeetCode.com

###  Requirements

LeetCode Crawler uses a number of open source projects to work properly:

* [React Bootstrap] - Bootstrap rebuilt for React
* [node.js] - JavaScript runtime built on Chrome's V8 JavaScript engine
* [Express] - Fast node.js network app framework
* [mongoose] - Elegant mongodb object modeling for node.js
* [puppeteer] - Headless Chrome Node.js API
* [cheerio] - Fast, flexible, and lean implementation of core jQuery designed specifically for the server
* [node-schedule] - A cron-like and not-cron-like job scheduler for Node
* [nodemon] - Monitor for any changes in your source and automatically restart your server
* [winston] - A logger for just about everything.


### Installation

LeetCode Crawler requires [Node.js](https://nodejs.org/)

#### Environment variables

Set up the envrionment variable before running.

| Name | Description | Example 
| ------ | ------ | ------|
| MONGO_URI | Mongo DB URI | mongodb://user:password@abc.domain.com:37308/collection
| NODE_ENV | Envrionment Flag | production

#### Server side installation

```
$ npm install
$ npm run start
```

#### Server side installation

```
$ cd client
$ npm install
$ npm run start
```

### Todos

 - Make Front-end responsive 
 - Data visualization
 - Time series analysis


   [node.js]: <http://nodejs.org/>
   [React Bootstrap]: <https://react-bootstrap.github.io/>
   [express]: <http://expressjs.com/>
   [mongoose]: <https://mongoosejs.com/>
   [puppeteer]: <https://github.com/GoogleChrome/puppeteer>
   [cheerio]:<https://cheerio.js.org/>
   [node-schedule]: <https://github.com/node-schedule/node-schedule>
   [nodemon]: <https://nodemon.io/>
   [winston]: <https://github.com/winstonjs/winston>


