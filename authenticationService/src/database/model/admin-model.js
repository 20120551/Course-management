const mongoose = require('mongoose');


const {Schema, model} = mongoose;

const Admin = new Schema({
    name: String,
    image: {type: String, default: 'https://www.dreamstime.com/admin-sign-laptop-icon-stock-vector-image166205404'},
    isLeader: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = model('admin', Admin);