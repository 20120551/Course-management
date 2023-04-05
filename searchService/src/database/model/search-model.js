const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Search = new Schema({
    _id: {type: String, require: true},
    name: {type: String, require: true},
    background: String,
    subject: String,
    theme: {
        _id: {type: String, require: true},
        name: String,
    },
    teacher: {
        _id: {type: String, require: true},
        name: {type: String, require: true},
        image: {type: String},
    }
});

module.exports = model('search', Search);