const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Comment = new Schema({
    user: {
        _id: {type: String, require: true},
        name: String,
        image: String
    },
    content: {
        text: String,
        image: String,
    },
    replies: [{type: Schema.ObjectId, ref: 'comment'}]
})

module.exports = model('comment', Comment);