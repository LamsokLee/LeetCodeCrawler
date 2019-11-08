const mongoose = require('mongoose');
const url = require('../config/keys');
const logger = require('./logging');

mongoose.connect(url.mongoURI, {useNewUrlParser : true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // connected
    logger.info('Database connected');
});