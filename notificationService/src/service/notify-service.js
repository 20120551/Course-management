const {notifyRepository} = require('./../database');
const {FormatData} = require('./../utils');

const notifyService = {
    getAllComment: async(userId)=>{
        try {
            const notify = await notifyRepository.getAllNotifications(userId);
            await notifyRepository.updateAllNewsNotification(userId);
            return FormatData({notify});
        } catch(err) {
            throw err;
        }
    },
    deleteNotification: async(userId, notificationId)=>{
        try {
            await notifyRepository.deleteNotification(userId, notificationId);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = notifyService;