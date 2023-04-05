const {eventService} = require('./../service');
const {FormatData} = require('./../utils');
const {performance} = require('perf_hooks');

const eventServiceProxy = {
    accountChanged: async(userInfo, event)=>{
        try {
            const t1 = performance.now();
            await eventService.accountChanged(userInfo, event);
            const t2 = performance.now();
            return FormatData({financialAccount, time: t2 - t1});
        } catch(err){
            throw err;
        }
    },
    courseChanged: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.courseChanged(courseInfo, teacherInfo, courseEvent);
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err){
            throw err;
        }
    },
    lessonChanged: async(courseId, lessonInfo, lessonEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.lessonChanged(courseId, lessonInfo, lessonEvent);
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
    assistantChanged: async(assistantInfo, courseInfo, assistantEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.assistantChanged(assistantInfo, courseInfo, assistantEvent);
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err){
            throw err;
        }
    },
}

module.exports = eventServiceProxy;