const {
    FormatData
} = require('./../utils');
const {discussionRepository, commentRepository, postRepository} = require('./../database');

const discussionService = {
    getAllEducators: async(postId)=>{
        try {
            const educators = await postRepository.findEducatorByPostId(postId);
            return FormatData({educators});
        } catch(err) {
            throw err;
        }
    },
    getAuthorComment: async(commentId)=>{
        try {
            const comment = await commentRepository.findCommentById(commentId);
            return FormatData({user: comment.user});
        } catch(err) {
            throw err;
        }
    },
    getParticularComment: async(commentId)=>{
        try {
            const comment = await commentRepository.findCommentById(commentId);
            return FormatData({comment});
        } catch(err) {
            throw err;
        }
    },
    getCommentInPost: async(postId)=>{
        try {
            const discussion = await discussionRepository.getCommentInPost(postId);
            return FormatData({discussion});
        } catch(err) {
            throw err;
        }
    },
    commentInPost: async(payload)=>{
        const {
            postId,
            user,
            data
        } = payload;
        try {
            const comment = await commentRepository.commentInPost(user, data);
            await discussionRepository.commentInPost({postId, commentId: comment._id});
            return FormatData({comment});
        } catch(err) {
            throw err;
        }
    },
    replyInPost: async(payload)=>{
        const {
            postId,
            user,
            data,
            reply
        } = payload;
        try {
            const comment = await commentRepository.commentInPost(user, data);
            await commentRepository.replyCommentInPost(comment._id, reply);
            return FormatData({comment});
        } catch(err) {
            throw err;
        }
    },
    modifyCommentInPost: async(payload)=>{
        const {
            commentId,
            data
        } = payload;
        try {
            await commentRepository.modifyCommentInPost(commentId, data);
        } catch(err) {
            throw err;
        }
    },
    deleteCommentInPost: async(postId, commentId)=>{
        try {
            await commentRepository.deleteCommentsInPost(commentId);
        } catch(err) {
            throw err;
        }
    },
    getLikeInPost: async(postId)=>{
        try {
            const likes = await discussionRepository.getLikeInPost(postId);
            return FormatData({likes});
        } catch(err) {
            throw err;
        }
    },
    toggleLikeInPost: async(payload)=>{
        const {
            postId,
            user
        } = payload;
        try {
            await discussionRepository.toggleLikeInPost(postId, user);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = discussionService;