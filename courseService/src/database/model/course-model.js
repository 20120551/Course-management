const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const {Schema, model} = mongoose;

const Course = new Schema({
    name: {type: String, require: true},
    background: String,
    subject: String,
    description: [{type:String}],
    price: {type: Number},
    grade: {type: String},
    state: {
        type: String,
        enum: ['REQUEST', 'DELETE', 'UPDATE'],
        default: 'REQUEST'
    },
    totalStudent: [{
        _id: {type: String, require: true},
        name: String,
        image: String,
    }],
    theme: {type: Schema.ObjectId, ref: 'theme'},
    chapters: [{
        name: {type: String, require: true},
        totalTime: {type: Number, default: 0}, // calculate by lessons time
        lessons: [{
            kind: {
                type: String,
                require: true,
                enum: ['exercise', 'lecture']
            },
            _id: {type: Schema.ObjectId, refPath: 'kind'}
        }]
    }],
    expires: {type: Number},
    teacher: {
        _id: {type: String, require: true},
        name: {type: String},
        image: {type: String},
        description: [{type: String}],
    },
    assistant: [{
        _id: {type: String, require: true},
        username: {type: String},
        name: {type: String},
        image: {type: String},
        startJoiningTime: {type: Date},
        endJoiningTime: {type: Date},
    }],
    rating: [{
        student: {
            _id: {type: String, require: true},
            name: {type: String},
            image: {type: String},
            username: {type: String},
        },
        state: {type: String, default: 'REQUEST'},
        rate: {type: Number},
        content: {type: String},
    }]
},{versionKey: false});

Course.plugin(mongoose_delete, { 
    withDeleted: true,
    deletedAt : true
});

module.exports = model('course', Course);