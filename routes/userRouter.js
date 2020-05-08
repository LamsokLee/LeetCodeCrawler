const express = require('express');
const router = express.Router();
const User = require('../app/schemas/User');

router.get('/', (req, res, next) => {
    // console.log(req);

    User.find({})
        .select('-_id user_id real_name contest_finished contest_ranking contest_rating location school progress_accepted progress_solved progress_submitted')
        .exec((err, user) => {
            if (user) {
                res.json(user);
            } else {
                res.json({ message: err });
            }
        });
})

router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    User.findOne({ user_id : id })
        .select('-_id user_id real_name contest_finished contest_ranking contest_rating location school progress_accepted progress_solved progress_submitted')
        .exec((err, user) => {
            if (user) {
                res.json(user);
            } else {
                res.json({ message: "User " + id + " doesn't exist" });
            }
        });
})

module.exports = router;