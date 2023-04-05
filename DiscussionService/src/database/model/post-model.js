const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const postDiscriminator = new Schema({
    kind: String,
}, {
    discriminatorKey: 'kind', 
    _id: false
})

const Post = new Schema({
    course: {
        _id: {type: String, require:  true},
        state: {type: String, default: 'REQUEST'},
        deleted: {type: Boolean, default: false}
    },
    educator: [{type: String, require: true}],
    posts: [postDiscriminator]
});

//when kind is lecture
Post.path('posts').discriminator('lecture', new Schema({
    _id: {type: String, require: true},
}));

//when kind is exercise
Post.path('posts').discriminator('exercise', new Schema({
    _id: {type: String, require: true},
    questions: [{type: String, require: true}]
}));

module.exports = model('post', Post);