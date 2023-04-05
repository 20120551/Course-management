const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Address = new Schema({
    commune: {type: String},
    district: {type: String},
    city: {type: String},
});

module.exports = model('address', Address);