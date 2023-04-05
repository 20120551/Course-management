const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const Recruit = new Schema({
    title: {type: String},
    require: [{type: String}],
    income: {type: Number},
    startRecruit: {type: Date},
    endRecruit: {type: Date},
    course: {
        _id: {type: String, require: true},
        name: {type: String},
        background: {type: String},
        subject: String,
        grade: String,
        theme: {
            _id: {type: String, require: true},
            name: {type: String, require: true}
        },
        state: {type: String, default: 'REQUEST'},
        deleted: {type: Boolean, default: false},
        teacher: {
            _id: {type: String, require: true},
            name: {type: String},
            image: {type: String}
        }
    },
    request: [{
        _id: {type: String, require: true},
        name: {type: String},
        image: {type: String},
        state: {type: String, default: 'REQUEST'},
    }],
},{versionKey: false })

module.exports = model('recruit', Recruit);