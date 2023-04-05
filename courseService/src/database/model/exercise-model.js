const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const {Schema, model} = mongoose;

const Exercise = new Schema({
    name: String,
    questions: [{type: Schema.ObjectId, ref: 'question'}],
    timeComplete: Number,
    deadline: Date,
    isBlock: {type: Boolean}
},{versionKey: false });

Exercise.plugin(mongoose_delete, {
    withDeleted: true,
    deletedAt: true
});

module.exports = model('Exercise', Exercise);