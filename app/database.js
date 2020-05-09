const mongoose = require('mongoose');
const url = require('../config/url');
const logger = require('./logging');

mongoose.connect(url.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    logger.info('Database connected');
});