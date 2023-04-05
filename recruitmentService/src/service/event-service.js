const { FormatData } = require('../utils');
const {event} = require('./../constant')
const {recruitRepository} = require('./../database');


const eventService = {
    courseChanged: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            switch(courseEvent) {
                case event.course.CREATE_COURSE:
                    await recruitRepository.createCourse(courseInfo, teacherInfo);
                    break;
                case event.course.DESTROY_COURSE:
                    await recruitRepository.destroyCourse(courseInfo, teacherInfo)
                    break;
                default:
                    await recruitRepository.updateCourse(courseInfo, teacherInfo);
                    break;
            }
        } catch(err){
            throw err;
        }
    },
    accountChanged: async(userInfo, userEvent)=>{
        try {
            switch(userEvent) {
                case event.user.TEACHER_UPDATED:
                    await recruitRepository.teacherUpdated(userInfo);
                    break;
                case event.user.ASSISTANCE_UPDATED:
                    await recruitRepository.assistantUpdated(userInfo);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    assistantStateChanged: async(userId, courseId, assData, assistantEvent)=>{
        try {
            let recruit = null;
            switch(assistantEvent) {
                case event.assistant_state.REJECT_STATE:
                    recruit = await recruitRepository.cancelAssistant(userId, courseId);
                    return FormatData({course: recruit.course});
                default:
                    recruit = await recruitRepository.updateAssistant(userId, courseId, assData);
                    return FormatData({course: recruit.course});
            }
        } catch(err) {
            throw err;
        }
    },
}

module.exports = eventService;