const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const courseCensor = new Schema({
    _id: {type: String, require: true},
    name: {type: String},
    subject: String,
    background: String,
    price: Number,
    deleted: {type: Boolean, default: false},
    expires: {type: Number},
    state: {
        type: String,
        enum: ['REQUEST', 'DELETE', 'UPDATE'],
        default: 'REQUEST'
    },
    teacher: {
        _id: {type: String, require: true},
        name: {type: String},
    },
    new: {type: Boolean, default: true}
},{versionKey: false });

module.exports = model('courseCensor', courseCensor);