const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const PermissionResource = new Schema({
    //_id: {type: Schema.Types.ObjectId}, 
    name: {type: String},
    code: {type: String}
})

module.exports = model('permissionResource', PermissionResource); 