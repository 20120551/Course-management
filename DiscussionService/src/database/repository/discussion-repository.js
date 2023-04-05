const {Discussion} = require('./../model');

const discussionRepository = {
    getCommentInPost: async(postId)=>{
        try {
            const discussion = await Discussion.findOne({_id: postId}).populate({
                path: 'commentIds',
                populate: {
                    path: 'comment'
                }
            });
            if(!discussion) throw new Error('discussion does not exist!');

            return discussion._doc || discussion;
        } catch(err) {
            throw err;
        }
    },
    commentInPost: async(payload)=>{
        const {
            postId,
            commentId
        } = payload;
        try {
            await Discussion.updateOne({_id: postId}, {
                $push: {
                    commentIds: {
                        _id: commentId
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    getLikeInPost: async(postId)=>{
        try {
            const likes = await Discussion.findOne({_id: postId}).select({likes: 1});
            if(!likes) throw new Error('likes does not exist!');

            return likes._doc || likes;
        } catch(err) {
            throw err;
        }
    },
    toggleLikeInPost: async(postId, user)=>{
        const {
            _id,
            name,
            image
        } = user;
        try {
            const post = await Discussion.findOne({_id: postId});
            if(!post) throw new Error('post does not exist!');

            const {likes} = post;

            //toggled when had liked
            if(!likes.some(like=>like._id === _id)) {
                likes = likes.filter(like=>like._id === _id)
            } else {
                likes.push({
                    _id,
                    name,
                    image
                })
            }
            await post.save();
        } catch(err) {
            throw err;
        }
    },
    updateProfile: async(userInfo)=>{
        const {
            _id,
            name,
            image
        } = userInfo;
        try {
            await Discussion.updateMany({}, {
                $set: {
                    'likes.$[elem].name': name,
                    'likes.$[elem].image': image,
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'elem._id': _id
                }]
            })
        } catch(err) {
            throw err;
        }
    },
    createPost: async(data)=>{
        const {
            _id
        } = data;
        try {
            const discussion = new Discussion({
                _id: _id
            });
            await discussion.save();
        } catch(err) {
            throw err;
        }
    },
    createPosts: async(data)=>{
        const {
            questions
        } = data;
        try {
            questions.forEach(async(question)=>{
                await discussionRepository.createPost(question);
            })
        } catch(err) {
            throw err;
        }
    },
    destroyPost: async(data)=>{
        const {
            _id
        } = data;
        try {
            await Discussion.deleteOne({_id: _id});
        } catch(err) {
            throw err;
        }
    },
    destroyPosts: async(data)=>{
        const {
            questions
        } = data;
        try {
            questions.forEach(async(question)=>{
                await discussionRepository.destroyPost({_id: question});
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = discussionRepository;