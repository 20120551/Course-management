const {eventService} = require('./../service');
const {FormatData} = require('./../utils');
const {performance} = require('perf_hooks');

const eventServiceProxy = {
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
    accountChanged: async(userInfo, userEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.accountChanged(userInfo, userEvent);
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
    assistantStateChanged: async(userId, courseId, assData, event)=>{
        try {
            const t1 = performance.now();
            const {course} = await eventService.assistantStateChanged(userId, courseId, assData, event);
            const t2 = performance.now();
            return FormatData({course, time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
}

module.exports = eventServiceProxy;