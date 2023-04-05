const {eventService} = require('./../service');
const {FormatData} = require('./../utils');
const {performance} = require('perf_hooks');

const eventServiceProxy = {
    accountChanged: async(userInfo, kind, userEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.accountChanged(userInfo, kind, userEvent);
            const t2 =  performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
    notificationChanged: async(dataInfo, userInfo, message, notifyEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.notificationChanged(dataInfo, userInfo, message, notifyEvent);
            const t2 =  performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventServiceProxy;