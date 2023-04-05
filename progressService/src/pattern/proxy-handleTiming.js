const {performance} = require('perf_hooks');
const eventService = require('./../service/event-service');
const {FormatData} = require('./../utils');

const eventServiceProxy = {
    accountChanged: async(userInfo, kind, userEvent)=>{
        try {
            const t1 = performance.now();
            const progress = eventService.accountChanged(userInfo, kind, userEvent);
            const t2 = performance.now();
            return FormatData({progress, time: t2 - t1});
        } catch(err){
            throw err;
        }
    },
    addStudentToCourse: async(userInfo, coursesInfo)=>{
        try {
            const t1 = performance.now();
            const {courses} = await eventService.addStudentToCourse(userInfo, coursesInfo);
            const t2 = performance.now();
            return FormatData({courses, time: t2 - t1});
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
    lessonChanged: async(courseId, lessonInfo, lessonEvent, index)=>{
        try {
            const t1 = performance.now();
            await eventService.lessonChanged(courseId, lessonInfo, lessonEvent, index);
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    },
    chapterChanged: async(courseId, chapterInfo, chapterEvent, index)=>{
        try {
            const t1 = performance.now();
            await eventService.chapterChanged(courseId, chapterInfo, chapterEvent, index);
            const t2 = performance.now();
            return FormatData({time: t2 - t1});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventServiceProxy;