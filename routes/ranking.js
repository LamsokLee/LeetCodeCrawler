const express = require('express');
const router = express.Router();
const Problem = require('../app/database');

router.get('/', (req, res, next) => {
    const id = req.params.id;

    Problem.find({})
    .select('-_id question_id frontend_id question__title question__title_slug total_acs total_submitted like_count dislike_count difficulty acceptance_rate like_rate')
    .exec((err, problem) => {
        if (problem) {
        res.json(problem);
        } else {
        res.json({ message: err });
        }
    });
})

router.get('')

module.exports = router;