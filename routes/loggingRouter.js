const express = require('express');
const router = express.Router();
var logger = require('../app/logging');

router.get('/', (req, res, next) => {
    const options = {
      limit: 100,
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

  router.get('/:count', (req, res, next) => {
    const options = {
      limit: req.params.count,
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

  router.get('/lastUpdate', (req, res, next) => {
    const options = {
      start: 0,
      order: 'desc',
    };
    logger.query(options, (err, results) => {
      if (err) {
        logger.error(err);
      }
      
    });
  })
  
  module.exports = router;  