const {discussionService} = require('./../service');
const {queue, status, event} = require('./../constant');

class DiscussionController {
    constructor(conn){
        this.conn = conn;
    }

    getCommentInPost = async(req, res)=>{
        try {
            const {postId} = req.params;
            const {discussion} = await discussionService.getCommentInPost(postId);

            res.status(status.OK).json(discussion);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getParticularComment = async(req, res)=>{
        try {
            const {commentId} = req.params;
            const {comment} = await discussionService.getParticularComment(commentId);

            res.status(status.OK).json(comment);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    
    commentInPost = async(req, res)=>{
        try {
            const {postId} = req.params;
            const {_id, name, image} = req.user;
            const data = req.body;

            const payload = {
                postId,
                user: {
                    _id,
                    name,
                    image
                },
                data
            };
            const {comment} = await discussionService.commentInPost(payload);
            const {educators} = await discussionService.getAllEducators(postId); 

            //send data to notification service to all educators
            const channel = await this.conn.createChannel();

            educators.forEach(async(educator)=>{
                await channel.assertQueue(queue.NOTIFY_PUBLISH);    
                await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                    userInfo: {
                        _id: educator,
                    },
                    dataInfo: {
                        post: {
                            _id: postId,
                            ...data
                        },
                        discussion: {
                            user: req.user,
                            comment: comment
                        }
                    },
                    event: event.notify.comment.COMMENT_IN_POST
                })));
            })
            res.status(status.OK).json('comment successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    replyCommentInPost = async(req, res)=>{
        try {
            const {postId} = req.params;
            const {_id, name, image} = req.user;
            const {commentId} = req.query;
            const data = req.body;

            const payload = {
                reply: commentId,
                postId,
                user: {
                    _id,
                    name,
                    image
                },
                data
            };

            const {comment} = await discussionService.replyInPost(payload);
            const {user} = await discussionService.getAuthorComment(commentId);

            //send data to notification service
            const channel = await this.conn.createChannel();

            await channel.assertQueue(queue.NOTIFY_PUBLISH);    
            await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                userInfo: user,
                dataInfo: {
                    post: {
                        _id: postId,
                        ...data
                    },
                    discussion: {
                        user: req.user,
                        comment: comment
                    }
                },
                event: event.notify.comment.REPLY_IN_POST
            })));
            res.status(status.OK).json('reply comment successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    modifyCommentInPost = async(req, res)=>{
        try {
            const {commentId} = req.params;
            const data = req.body;
            const payload = {
                commentId,
                data
            };
            await discussionService.modifyCommentInPost(payload);
            res.status(status.OK).json('modify comment successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    deleteCommentInPost = async(req, res)=>{
        try {
            const {commentId, postId} = req.params;
            await discussionService.deleteCommentInPost(postId, commentId); 
            res.status(status.OK).json('delete comment successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getLikeInPost = async(req, res)=>{
        try {
            const {postId} = req.params;
            const {likes} = await discussionService.getLikeInPost(postId);
            res.status(status.OK).json(likes);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    toggleLikeInPost = async(req, res)=>{
        try {
            const {_id, name, image} = req.user;
            const {postId} = req.params;
            const payload = {
                postId,
                user: {
                    _id, 
                    name,
                    image
                }
            }
            await discussionService.toggleLikeInPost(payload);
            res.status(status.OK).json('toggle like successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = DiscussionController;