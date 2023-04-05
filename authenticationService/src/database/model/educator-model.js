const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Educator = new Schema({
    name: {type: String, require: true},
    image: {type: String, default: 'https://hocmai.vn/pix/u/f1.png'},
    birthDay: {type: String, default: '01/01/2022'},
    workPlace: {type: String},
    degree: {type: String},
    description: [{type: String}],
    facebook: {type: String},
    sex: {type: String},
    phoneNumber: {type: String},
    teaching: [{type: String}],
    address: {type: Schema.Types.ObjectId, ref: 'address'},
    budget: {
        _id: {type: String, require: true},
        money: Number,
        transferHistory: [{
            _id: {type: String, require: true},
            idSour: {type: String, require: true},
            idDes: {type: String, require: true},
            transferMoney: Number,
            state: String
        }],
        rechargeHistory: [{
            _id: {type: String, require: true},
            idDes: {type: String, require: true},
            rechargeMoney: Number,
            state: String
        }]
    },
    //check redirect to /course/:id
    courses: [{
        _id: {type: String, require: true},
        name: {type: String, require: true},
        background: String,
        subject: String,
        grade: String,
        expires: {type: Number},
        deleted: {type: Boolean, default: false},
        theme: {
            _id: {type: String, require: true},
            name: {type: String, require: true}
        },
        state: {
            type: String,
            enum: ['REQUEST', 'DELETE', 'UPDATE'],
            default: 'REQUEST'
        },
    }],
    //click redirect to /progress/:id
    assistanceCourse: [{
        _id: {type: String, require: true},
        name: {type: String, require: true},
        background: String,
        subject: String,
        grade: String,
        theme: {
            _id: {type: String, require: true},
            name: {type: String, require: true}
        },
    }],
},{ versionKey: false })

module.exports = model('educator', Educator);