const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Discussion = new Schema({
    _id: {type: String, require: true}, //id ~= questionId
    commentIds: [{type: Schema.ObjectId, ref: 'comment'}],
    likes: [{
        _id: {type: String, require: true},
        name: String,
        image: String
    }]
})

module.exports = model('discussion', Discussion);