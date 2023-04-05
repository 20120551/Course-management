const {eventService} = require('./../service');
const {FormatData} = require('./../utils');
const {performance} = require('perf_hooks');

const proxyEventService = {
    transferBudget: async(sourceInfo, desInfo)=>{
        try {
            const t1 = performance.now();
            const {financialHistory} = await eventService.transferBudget(sourceInfo, desInfo);
            const t2 = performance.now();
            return FormatData({financialHistory, time: t2 - t1});
        } catch(err){
            throw err;
        }
    },
    accountChanged: async(userInfo, event)=>{
        try {
            const t1 = performance.now();
            await eventService.accountChanged(userInfo, event);
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err){
            throw err;
        }
    }
}

module.exports = proxyEventService;