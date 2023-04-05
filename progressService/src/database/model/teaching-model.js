const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Teaching = new Schema({
    _id: {type: String, require: true},
    name: String,
    background: String,
    subject: String,
    state: {
        type: String,
        enum: ['REQUEST', 'DELETE', 'UPDATE'],
        default: 'REQUEST'
    },
    deleted: {type: Boolean, default: false},
    educator: [{
        _id: {type: String, require: true},
        name: String,
    }],
    chapters: [{
        name: String,
        exercise: [{
            _id: {type: String, require: true},
            name: String,
            deleted: {type: Boolean, default: false},
            isBlock: {type: Boolean, default: true},
            timeComplete: Number,
            deadline: Date,
            submit: [{
                _id: {type: String, require: true},
                name: String,
                username: String,
                timeSubmit: Number,
                score: Number,
                isScored: {type: Boolean, default: false},
                // [[1], [1,2], [3], ...]
                answers: [[{type: Number}]],
            }],
            questions: [{
                _id: {type: String, require: true},
                question: {type: String, require: true},
                answers: [{
                    key: String,
                    isResult: {type: Boolean, default: false}
                }]
            }]
        }]
    }]

},{ versionKey: false });

module.exports = model('teaching', Teaching);