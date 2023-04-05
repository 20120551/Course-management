const {eventService} = require('./../service');
const {performance} = require('perf_hooks');
const {FormatData} = require('./../utils');

const proxyEventService = {
    accountChanged: async(userInfo, event)=>{
        try {
            const t1 = performance.now();
            await eventService.accountChanged(userInfo, event);
            const t2 = performance.now();

            return FormatData({time: t2 - t1});
        } catch(err){
            throw err;
        }
    },
    cartChanged: async(courseInfo, userInfo, cartEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.cartChanged(courseInfo, userInfo, cartEvent);
            const t2 = performance.now();

            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = proxyEventService;