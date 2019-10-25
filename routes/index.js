var express = require('express');
var router = express.Router();
var logger = require('../app/logging');
const Problem = require('../app/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LeetCode Crawler' });
});

router.get('/api/v1/log/', (req, res, next) => {
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

router.get('/api/v1/question/:id', (req, res, next) => {
  const id = req.params.id;

  Problem.findOne({question_id : id})
  .select('-_id question_id question__title question__title_slug total_acs total_submitted like_count dislike_count difficulty')
  .exec((err, problem) => {
    if (problem) {
      res.json(problem);
    } else {
      res.json({ message: "Question " + id + " doesn't exist"});
    }
  });
})

module.exports = router;
