const {eventService} = require('./../service')
const {performance} = require('perf_hooks');
const { FormatData } = require('../utils');

const eventServiceProxy = {
    requestCensorship: async(courseInfo, userInfo, message, event)=>{
        try {
            const t1 = performance.now();
            await eventService.requestCensorship(courseInfo, userInfo, message, event);
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
    accountChanged: async({event: userEvent, user, kind})=>{
        try {
            const t1 = performance.now();
            await eventService.accountChanged({userEvent, user, kind});
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
    requestCourse: async(courseInfo, teacherInfo, event)=>{
        try {
            const t1 = performance.now();
            await eventService.requestCourse(courseInfo, teacherInfo, event);
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
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventServiceProxy;