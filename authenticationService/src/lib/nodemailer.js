const nodemailer = require("nodemailer");
const {SYSTEM_MAIL, PASSWORD} = require('./../config');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: SYSTEM_MAIL, // generated ethereal user
        pass: PASSWORD, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;
