var express = require('express');
var router = express.Router();
const Problem = require('../crawler/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
