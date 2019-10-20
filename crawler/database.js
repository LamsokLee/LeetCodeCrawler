const url = require('../config/url');
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(url.mongoURI, {useNewUrlParser : true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // connected
});

const leetCodeSchema = new Schema({
    question_id : Number,
    question__title: String,
    question__title_slug : String,
    total_acs : Number,
    total_submitted : Number,
    difficulty: Number,
    like_count : Number,
    dislike_count : Number
});

const LeetCode = mongoose.model('LeetCode', leetCodeSchema);


module.exports = LeetCode;