module.exports = {
    connectRabbitMQ: require('./message-queue'),
    logger: require('./logger'),
    transporter: require('./nodemailer')
}