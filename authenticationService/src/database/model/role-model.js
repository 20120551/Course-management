const mongoose = require('mongoose');
const { role } = require('./../../constant');

const {Schema, model} = mongoose;

const Role = new Schema({
    //_id: {type: Schema.Types.ObjectId},
    roleName: {type: String, default: role.STUDENT},
    permission: [{type: Schema.Types.ObjectId, ref: 'permissionResource'}]
})

module.exports = model('role', Role);