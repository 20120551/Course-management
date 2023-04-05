const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const RefreshToken = new Schema({
    refreshToken: {type: String}
})

module.exports = model('refreshToken', RefreshToken);