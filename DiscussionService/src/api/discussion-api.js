const {authorizationMDW, postCheckingMDW} = require('./../middleware');
const {DiscussionController} = require('./../controller');

function discussionApi(app, conn){
    const discussionController = new DiscussionController(conn);
 
    //get discussion -> /discussion/:postId?...
    app.get(
        '/discussion/:postId',
        authorizationMDW.checkUser,
        discussionController.getCommentInPost
    )

    //get discussion -> /discussion/:postId/:commentId
    app.get(
        '/discussion/:postId/:commentId',
        authorizationMDW.checkUser,
        discussionController.getParticularComment
    )

    //post in discussion -> /discussion/:postId/comment
    app.post(
        '/discussion/:postId/comment',
        authorizationMDW.checkUser,
        discussionController.commentInPost
    )

    //post in discussion -> /discussion/:postId/reply?commentId=...
    app.post(
        '/discussion/:postId/reply',
        authorizationMDW.checkUser,
        discussionController.replyCommentInPost
    )

    //modify comment -> /discussion/:postId/:commentId
    app.put(
        '/discussion/:postId/:commentId',
        authorizationMDW.checkUser,
        postCheckingMDW.checkAuthorComment,
        discussionController.modifyCommentInPost
    )

    //delete comment -> /discussion/:postId/:commentId
    app.delete(
        '/discussion/:postId/:commentId',
        authorizationMDW.checkUser,
        postCheckingMDW.checkAuthor,
        discussionController.deleteCommentInPost
    )

    //get in discussion -> /discussion/:postId/like
    app.get(
        '/discussion/:postId/like',
        authorizationMDW.checkUser,
        discussionController.getLikeInPost
    )

    //post in discussion -> /discussion/:postId/like
    app.post(
        '/discussion/:postId/like',
        authorizationMDW.checkUser,
        discussionController.toggleLikeInPost
    )
}

module.exports = discussionApi;