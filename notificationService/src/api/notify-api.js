const {NotifyController} = require('./../controller');
const {authorizationMDW} = require('./../middleware');

function notifyApi(app, conn){
    try {
        const notifyController = new NotifyController(conn);
        //receive data from QUEUE

        app.get(
            '/notification',
            authorizationMDW.checkUser,
            notifyController.getAllComment
        );

        app.delete(
            '/notification/:notificationId',
            authorizationMDW.checkUser,
            authorizationMDW.checkAuthor,
            notifyController.deleteNotification
        )
    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = notifyApi;