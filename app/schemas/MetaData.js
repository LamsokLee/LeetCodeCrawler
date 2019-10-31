const mongoose = require('mongoose');
const { Schema } = mongoose;

const metaDataSchema = new Schema({
    id : Number,
    last_start : Date,
    last_update: Date
});

const MetaData = mongoose.model('MetaData', metaDataSchema);

module.exports = MetaData;
