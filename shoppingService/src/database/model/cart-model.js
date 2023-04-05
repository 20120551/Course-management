const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Cart = new Schema({
    customer: {
        _id: {type: String, require: true},
        name: String,
    },
    items: [{
        _id: {type: String, require: true},
        name: String,
        price: Number,
        grade: String,
        subject: String,
        theme: {
            _id: {type: String, require: true},
            name: String,
        },
        expires: {type: Number},
        teacher: {
            _id: {type: String, require: true},
            name: String,
        }
    }]
},{ versionKey: false });

module.exports = model('cart', Cart);