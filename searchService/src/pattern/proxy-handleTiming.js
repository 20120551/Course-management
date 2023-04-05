const {eventService} = require('./../service');
const {FormatData} = require('./../utils');
const {performance} = require('perf_hooks');

const eventServiceProxy = {
    accountChanged: async({event: userEvent, user})=>{
        try {
            const t1 = performance.now();
            await eventService.accountChanged({userEvent, user});
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
    courseChanged: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.courseChanged(courseInfo, teacherInfo, courseEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err){
            throw err;
        }
    },
}

module.exports = eventServiceProxy;