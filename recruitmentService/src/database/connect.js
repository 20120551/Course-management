const { MONGODB_URL } = require('./../config');
const mongoose = require('mongoose');

module.exports = async()=>{
    try {
        await mongoose.connect(MONGODB_URL);
        console.log('database connect successfully!');
    } catch(error) {
        console.log('error when connected with database: ', error);
    }
}