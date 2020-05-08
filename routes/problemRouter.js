const express = require('express');
const router = express.Router();
const Problem = require('../app/schemas/Problem');

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    console.log(id);

    Problem.findOne({ question_id: id })
        .select('-_id question_id question__title question__title_slug total_acs total_submitted like_count dislike_count difficulty')
        .exec((err, problem) => {
            console.log(problem);
            if (problem) {
                res.json(problem);
            } else {
                res.json({ message: "Question " + id + " doesn't exist" });
            }
        });
})

module.exports = router;