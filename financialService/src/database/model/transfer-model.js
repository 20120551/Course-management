const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Transfer = new Schema({
    money: {type: Number},
    state: {
        type: String,
        enum: ['res', 'rej']
    },
    purpose: String,
    source: {
        _id: {type: String, require: true},
        name: {type: String}
    },
    destination: {
        _id: {type: String, require: true},
        name: {type: String}
    },
})

module.exports = model('transfer', Transfer);