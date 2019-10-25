const express = require('express');
const router = express.Router();
var logger = require('../app/logging');

router.get('/', (req, res, next) => {
    const options = {
      from: new Date() - (24 * 60 * 60 * 1000),
      until: new Date(),
      limit: 1000,
      start: 0,
      order: 'desc',
    };
    logger.query(options, (err, results) => {
      if (err) {
        logger.error(err);
      }
      res.json(results);
    });
  })
  
  
  module.exports = router;  