const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Recharge = new Schema({
    money: {type: Number},
    state: {
        type: String,
        enum: ['res', 'rej']
    },
    purpose: String,
    destination: {
        _id: {type: String, require: true},
        name: {type: String}
    }
})

module.exports = model('recharge', Recharge);