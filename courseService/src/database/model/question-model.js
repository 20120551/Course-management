const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Question = new Schema({
    question: {type: String, require: true},
    answers: [{
        key: String,
        isResult: {type: Boolean, default: false}
    }]
},{versionKey: false });

module.exports = model('question', Question);