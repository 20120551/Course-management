const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const Student = new Schema({
    name: {type: String, require: true},
    image: {type: String, default: 'https://hocmai.vn/pix/u/f1.png'},
    birthDay: {type: String, default: '01/01/2022'},
    facebook: {type: String},
    sex: {type: String, default: 'Nam'},
    phoneNumber: {type: String},
    degree: {type: String},
    address: {type: Schema.Types.ObjectId, ref: 'address'},
    budget: {
        _id: {type: String, require: true},
        money: Number,
        transferHistory: [{
            _id: {type: String},
            idSour: {type: String},
            idDes: {type: String},
            transferMoney: Number,
            purpose: String,
            state: String
        }],
        rechargeHistory: [{
            _id: {type: String},
            idDes: {type: String},
            rechargeMoney: Number,
            purpose: String,
            state: String
        }]
    },
    courses: [{
        _id: {type: String, require: true},
        name: {type: String, require: true},
        background: String,
        subject: String,
        description: [{type:String}],
        isExpire: {type: Boolean, default: false},

        startRolling: {type: Date},
        endCourse: {type: Date},
        
        theme: {
            _id: {type: String, require: true},
            name: {type: String, require: true}
        },
    }],
    wishList: [{
        _id: {type: String, require: true},
        name: {type: String, require: true},
        background: String,
        subject: String,
        grade: String,
        price: Number,
        description: [{type: String}],
        theme: {
            _id: {type: String, require: true},
            name: {type: String, require: true}
        },
    }],
    cart: [{
        _id: {type: String, require: true},
        name: {type: String, require: true},
        background: String,
        subject: String,
        grade: String,
        price: Number,
        theme: {
            _id: {type: String, require: true},
            name: {type: String, require: true}
        },
    }],
    order: [{
        _id: {type:String, require: true},
        status: String,
        items: [{
            _id: {type: String, require: true},
            name: String,
            price: Number,
            teacher: {
                _id: {type: String, require: true},
                name: String,
            }
        }]
    }]
},{ versionKey: false });

module.exports = model('student', Student);