const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const TeacherCensor = new Schema({
    teacher: {
        _id: {type: String, require: true},
        username: {type: String},
        name: String,
        image: String,
    },
        
    courseCensor: [{
        _id: {type: String, require: true},
        name: {type: String},
        subject: String,
        deleted: {type: Boolean, default: false},
        state: {
            type: String,
            enum: ['REQUEST', 'DELETE', 'UPDATE'],
            default: 'REQUEST'
        },
        assistant: [{
            _id: {type: String, require: true},
            username: {type: String},
            image: {type: String},
            name: {type: String},
            message: {type: String},
            state: {
                type: String,
                default: 'REQUEST'
            },
            startJoiningTime: {type: Date},
            endJoiningTime: {type: Date},
            new: {type: Boolean, default: true}
        }],
        rating: [{
            student: {
                _id: {type: String, require: true},
                name: {type: String},
                image: {type: String},
                username: {type: String},
            },
            state: {
                type: String,
                default: 'REQUEST'
            },
            rate: {type: Number},
            content: {type: String},
            ratingDay: Date,
            new: {type: Boolean, default: true}
        }]
    }],
},{versionKey: false });

module.exports = model('teacherCensor', TeacherCensor);