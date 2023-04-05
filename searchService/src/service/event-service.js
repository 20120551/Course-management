const { FormatData } = require('../utils');
const {searchRepository} = require('./../database');
const {event} = require('./../constant')

const eventService = {
    accountChanged: async({userEvent, user})=>{
        try {
            switch(userEvent) {
                case event.user.TEACHER_UPDATED: {
                    await searchRepository.updateTeacherProfile(user);
                    break;
                }
                default: 
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    courseChanged: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            switch(courseEvent) {
                case    event.course.CREATE_COURSE
                    ||  event.course.RESTORE_COURSE:
                    await searchRepository.createCourse(courseInfo, teacherInfo);
                    break;
                case    event.course.DESTROY_COURSE
                    ||  event.course.DELETE_COURSE:
                    await searchRepository.destroyCourse(courseInfo, teacherInfo);
                    break;
                default:
                    await searchRepository.updateCourse(courseInfo, teacherInfo);
                    break;
            }
        } catch(err){
            throw err;
        }
    },
}

module.exports = eventService;