const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const {Schema, model} = mongoose;

const Lecture = new Schema({
    name: String,
    background: {type: String},
    code: {type: String},
    description: [{type: String}],
    isBlock: {type: Boolean},
    totalTime: {type: Number},
},{versionKey: false });

Lecture.plugin(mongoose_delete, { 
    withDeleted: true,
    deletedAt: true
});

module.exports = model('lecture', Lecture);