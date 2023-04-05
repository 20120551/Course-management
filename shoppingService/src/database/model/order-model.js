const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Order = new Schema({
    customer: {
        _id: {type: String, require: true},
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE', 'PENDING', 'DEFAULT'],
        default: 'DEFAULT'
    },
    items: [{
        _id: {type: String, require: true},
        name: String,
        price: Number,
        grade: String,
        subject: String,
        theme: {
            _id: String,
            name: String,
        },
        expires: {type: Number},
        teacher: {
            _id: {type: String, require: true},
            name: String,
        }
    }]
}, {
    timestamps:true,
    versionKey: false 
});

module.exports = model('order', Order);