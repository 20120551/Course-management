const winston = require('winston');

const {format, createLogger} = winston;

const customFormat = format.combine(
    format.timestamp(), 
    format.colorize(),
    format.printf((info)=>{
        return `${info.timestamp} - [${info.level.toUpperCase().padEnd(7)}] - ${info.message}`;
    }),

)

const logger = createLogger({
    format: customFormat,
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'app.log'})
    ]
});

module.exports = logger;