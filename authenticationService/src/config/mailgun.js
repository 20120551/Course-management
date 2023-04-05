//config mail sending
const {DOMAIN_MAIL, API_KEY} = require('./index');
const mailgun = require("mailgun-js");

const DOMAIN = DOMAIN_MAIL;
const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});

module.exports = mg;