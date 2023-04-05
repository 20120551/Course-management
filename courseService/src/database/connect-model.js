const mongoose = require('mongoose');
const {MONGODB_URL } = require('./../config');

async function connectDatabase() {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log('database connect successfully!');
    } catch(err) {
        console.log('err when connect mongo db server!');
    }
}

module.exports = connectDatabase;