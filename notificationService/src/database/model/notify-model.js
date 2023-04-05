const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Notify = new Schema({
    user: {
        _id: {type: String, require: true},
        name: String,
        image: String,
    },
    notification: [new Schema({
        notificationId: {type: String, require: true},
        title: {type: String, require: true},
        type: {
            name: String,
            image: String,
        },
        message: {type: String},
        new: {type: Boolean, default: true},
        redirect: {type: String, require: true}
    }, { _id: false })]
});

module.exports = model('notify', Notify);