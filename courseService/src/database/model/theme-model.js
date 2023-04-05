const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Theme = new Schema({
    name: {type: String, require: true},
    subjects: [{type: String}],
    grades: [{type: String}],
});

module.exports = model('theme', Theme);