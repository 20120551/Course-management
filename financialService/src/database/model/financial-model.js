const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Financial = new Schema({
    money: {type: Number},
    rechargeHistory: [{type: Schema.ObjectId, ref: 'recharge'}],
    transferHistory: [{type: Schema.ObjectId, ref: 'transfer'}],
    user: {
        _id: {type: String, require: true},
        name: {type: String}
    }
})

module.exports = model('financial', Financial);