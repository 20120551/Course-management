const {commentRepository, discussionRepository, postRepository} = require('./../database');
const {status} = require('./../constant');

const postCheckingMDW = {
    checkAuthorComment: async(req, res, next)=>{
        try {
            const {commentId} = req.params;
            const {_id} = req.user;
            const comment = await commentRepository.findCommentById(commentId);
            if(!comment) 
                return res.status(status.UN_AUTHORIZED).json("Comment does not exists!");
            //check auth of comment
            const {user} = comment;
            if(user._id !== _id) 
                return res.status(status.UN_AUTHORIZED).json("you're not permission!");

            next();
        } catch(err) {
            throw err;
        }
    },
    checkAuthor: async(req, res, next)=>{
        try {
            const {commentId, postId} = req.params;
            const {_id} = req.user;
            const comment = await commentRepository.findCommentById(commentId);
            if(!comment) 
            return res.status(status.UN_AUTHORIZED).json("Comment does not exists!");

            const educator = await postRepository.findEducatorByPostId(postId);
            //check auth of comment
            const {user} = comment;
            if(user._id !== _id && !educator.includes(_id)) 
                return res.status(status.UN_AUTHORIZED).json("you're not permission!");

            next();
        } catch(err) {
            throw err;
        }
    }
}

module.exports = postCheckingMDW;