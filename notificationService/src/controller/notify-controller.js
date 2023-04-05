const {status} = require('./../constant');
const {notifyService} = require('./../service');

class NotifyController {
    getAllComment = async(req, res)=>{
        try {
            const {_id} = req.user;
            const {notify} = await notifyService.getAllComment(_id);

            res.status(status.OK).json(notify);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    deleteNotification = async(req, res)=>{
        try {
            const {_id} = req.user;
            const {notificationId} = req.params;
            await notifyService.deleteNotification(_id, notificationId);

            res.status(status.OK).json('delete notification successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = NotifyController;