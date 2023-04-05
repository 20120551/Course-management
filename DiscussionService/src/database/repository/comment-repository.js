const {Comment} = require('./../model');

const commentRepository = {
    findCommentById: async(commentId)=>{
        try {
            const comment = await Comment.findOne({_id: commentId});
            if(!comment) throw new Error('comment does not exist!');

            return comment._doc || comment;
        } catch(err) {
            throw err;
        }
    },
    commentInPost: async(user, data)=>{
        const {
            _id,
            name,
            image
        } = user;
        const {
            text,
            image: commentImage
        } = data;
        try {
            const comment = new Comment({
                user: {
                    _id,
                    name,
                    image
                },
                content: {
                    text,
                    image: commentImage
                }
            })

            const result = await comment.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        } 
    },
    replyCommentInPost: async(commentId, reply)=>{
        try {
            await Comment.updateOne({_id: reply}, {
                $push: {
                    replies: commentId
                }
            })
        } catch(err) {
            throw err;
        } 
    },
    modifyCommentInPost: async(commentId, data)=>{
        const {
            text,
            image
        } = data;
        try {
            await Comment.updateOne({_id: commentId}, {
                $set: {
                    'content.text': text,
                    'content.image': image
                }
            })
        } catch(err) {
            throw err;
        }
    },
    deleteCommentsInPost: async(commentId)=>{
        try {
            const {replies} = await Comment.findOneAndDelete({_id: commentId});
            if(!replies) throw new Error('comment does not exist!');

            await Comment.deleteMany({_id: {
                $in: replies
            }})
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
            await Comment.updateMany({'user._id': _id},{
                $set: {
                    'user.name': name,
                    'user.image': image
                }
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = commentRepository;