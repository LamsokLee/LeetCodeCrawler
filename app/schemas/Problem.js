const mongoose = require('mongoose');
const { Schema } = mongoose;

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
