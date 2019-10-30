const url = require('../config/url');
const mongoose = require('mongoose');
const logger = require('./logging');
const { Schema } = mongoose;

mongoose.connect(url.mongoURI, {useNewUrlParser : true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // connected
    logger.info('Database connected');
});

const problemSchema = new Schema({
    question_id : Number,
    frontend_id : Number,
    question__title: String,
    question__title_slug : String,
    total_acs : Number,
    total_submitted : Number,
    acceptance_rate : Schema.Types.Decimal128,
    like_rate: Schema.Types.Decimal128,
    difficulty: Number,
    like_count : Number,
    dislike_count : Number,
    last_update: Date
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;