module.exports = {
    connectRabbitMQ: require('./message-queue'),
    logger: require('./logger'),
    mg: require('./mailgun'),
    transporter: require('./nodemailer')
}