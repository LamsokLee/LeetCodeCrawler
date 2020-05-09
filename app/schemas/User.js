const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    user_id : String,
    user_page : String,
    real_name : String,
    location : String,
    company : String,
    school : String,
    contest_finished : Number,
    contest_rating : Number,
    contest_ranking : Number,
    contest_ranking_china : Number,
    progress_solved : Number,
    progress_accepted : Number,
    progress_submitted : Number, 
    progress_acceptance_rate : Schema.Types.Decimal128,
    contribution_points : Number,
    contribution_problems : Number,
    contribution_test_cases : Number,
    contest_history : Array,
    last_updated: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
