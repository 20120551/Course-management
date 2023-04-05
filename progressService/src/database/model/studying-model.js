const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const lessonsDiscriminator = new Schema({
    _id: String,
    kind: String,
}, {
    discriminatorKey: 'kind', 
    _id: false
})

const Studying = new Schema({
    user: {
        _id: {type: String, require: true},
        name: String,
        username: String,
    },
    courses: [{
        _id: {type: String, require: true},
        name: {type: String, require: true},
        background: String,
        subject: String,
        description: [{type: String}],

        startRolling: {type: Date},
        endCourse: {type: Date},
        
        theme: {
            _id: {type: String, require: true},
            name: {type: String, require: true}
        },
        chapters: [{
            name: {type: String, require: true},
            totalViewTime: {type: Number, default: 0},
            totalTime: {type: Number, default: 0},
            lessons: [lessonsDiscriminator]
        }]
    }],
}, { versionKey: false });

//when kind is lecture
Studying.path('courses.chapters.lessons').discriminator('lecture', new Schema({
    //_id: {type: String, require: true},
    name: {type: String, require: true},
    isBlock: {type: Boolean},
    background: String,
    code: String,
    deleted: {type: Boolean, default: false},
    description: [{type: String}],
    //progress view lecture
    totalViewTime: {type: Number, default: 0},
    totalTime: {type: Number, default: 0},
}));

//when kind is exercise
Studying.path('courses.chapters.lessons').discriminator('exercise', new Schema({
    _id: {type: String, require: true},
    name: String,
    timeComplete: Number,
    score: Number,
    rank: {type: String},
    deleted: {type: Boolean, default: false},
    state: {
        type: String, 
        enum: ['REQUEST', 'READY'],
        default: 'REQUEST'
    },
    isBlock: {type: Boolean},
    isExpire: {type: Boolean, default: false},
    questions: [{
        _id: {type: String, require: true},
        question: {type: String, require: true},
        isCorrect: {type: Boolean},
        answers: [{
            key: String,
            isResult: {type: Boolean, default: false},
            isChoose: {type: Boolean, default: false}
        }],
    }]
}));

module.exports = model('Studying', Studying);