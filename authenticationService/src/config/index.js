require('dotenv').config()

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGODB_URL,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    DOMAIN_MAIL: process.env.DOMAIN_EMAIL,
    API_KEY: process.env.API_KEY,
    SYSTEM_MAIL: process.env.SYSTEM_MAIL,
    PASSWORD: process.env.PASSWORD,
    ACTIVE_TOKEN: process.env.ACTIVE_TOKEN,
    MAIL_EXCHANGE_TOKEN: process.env.MAIL_EXCHANGE_TOKEN,
    USER_ID_TOKEN: process.env.USER_ID_TOKEN,
}