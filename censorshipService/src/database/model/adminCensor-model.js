const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const AdminCensor = new Schema({
    _id: {type: String, require: true},
    username: {type: String},
    name: String,
    image: String,
    acceptableCourse: [{type: Schema.ObjectId, ref: 'courseCensor'}]
},{versionKey: false });

module.exports = model('adminCensor', AdminCensor);