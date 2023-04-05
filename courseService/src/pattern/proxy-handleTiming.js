const {eventService} = require('./../service');
const {performance} = require('perf_hooks');
const {FormatData} = require('./../utils');

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
    enrollCourses: async(cartInfo, userInfo)=>{
        try {
            const t1 = performance.now();
            const {courses} = await eventService.enrollCourses(cartInfo, userInfo);
            const t2 = performance.now();

            return FormatData({courses, time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
    ratingStateChanged: async(userId, courseId, ratingData, ratingEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.ratingStateChanged(userId, courseId, ratingData, ratingEvent);
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
    },
    courseStateChanged: async(courseInfo, courseEvent)=>{
        try {
            const t1 = performance.now();
            const {course} = await eventService.courseStateChanged(courseInfo, courseEvent);
            const t2 = performance.now();
            return FormatData({time: t2 - t1, course});
        } catch(err) {
            throw err;
        }
    },
    progressChanged: async(courseInfo, userInfo, progressEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.progressChanged(courseInfo, userInfo, progressEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err) {
            throw err;
        }
    },
}

module.exports = eventServiceProxy;