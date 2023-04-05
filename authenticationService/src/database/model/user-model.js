const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const User = new Schema({
    //_id: {type: Schema.Types.ObjectId},
    username: {
        type: String, 
        default: '',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {type: String, default: ''},
    roleIds: [{type: Schema.Types.ObjectId, ref: 'role'}],
    isActive: {type: Boolean, default: false},
    kind: {
        type: String,
        require: true,
        enum: ['educator', 'student', 'admin']
    },
    userType: {type: Schema.Types.ObjectId, refPath: 'kind'}
},
{
    timestamps: true
}
)

module.exports = model('user', User);