const winston = require('winston');
const config = require('../config/config');

const logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json()
    ),
    
    transports: [
        new winston.transports.File({ filename: 'combined.log'})
    ]
});

if (process.env.NODE_ENV != 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;
