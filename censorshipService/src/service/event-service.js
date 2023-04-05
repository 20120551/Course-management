const {
    FormatData
} = require('./../utils');
const {teacherCensorRepository, adminCensorRepository} = require('./../database');
const {event} = require('./../constant');
const censorFactory = require('./../pattern/factory-censor');

const eventService = {
    requestCensorship: async(courseInfo, userInfo, message, censorEvent)=>{
        try {
            switch(censorEvent) {
                case event.teacher_censor.REQUEST_ASSISTANT:
                    await teacherCensorRepository.createAssistant(courseInfo, userInfo, message);
                    break;
                case event.teacher_censor.CANCEL_ASSISTANT:
                    await teacherCensorRepository.cancelAssistant(courseInfo, userInfo);
                    break;
                case event.teacher_censor.REQUEST_RATING:
                    await teacherCensorRepository.requestRating(courseInfo, userInfo, message);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    accountChanged: async({userEvent, user, kind})=>{
        let censorRepository = censorFactory.createCensor(kind);
        if(kind && !censorRepository) throw new Error('user not define on this service!');

        try {
            switch(userEvent) {
                case event.user.CREATE_ACCOUNT:
                    await censorRepository.createCensor(user);
                    break;
                case event.user.STUDENT_UPDATED:
                    await teacherCensorRepository.updateStudentProfile(user);
                    break;
                case event.user.ASSISTANCE_UPDATED:
                    await teacherCensorRepository.updateAssistantProfile(user);
                    break;
                default:
                    await censorRepository.updateProfile(user);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    requestCourse: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            switch(courseEvent) {
                case event.course.CREATE_COURSE:
                    await teacherCensorRepository.createCourse(teacherInfo, courseInfo);
                    await adminCensorRepository.createCourse(courseInfo, teacherInfo);
                    break;
                case event.course.DESTROY_COURSE:
                    await teacherCensorRepository.destroyCourse(teacherInfo, courseInfo);
                    await adminCensorRepository.destroyCourse(courseInfo);
                    await adminCensorRepository.removeCourseToAdminCensor(courseInfo._id);
                    break;
                case event.course.UPDATE_COURSE: 
                    await teacherCensorRepository.updateCourse(teacherInfo, courseInfo);
                    await adminCensorRepository.updateCourse(courseInfo, teacherInfo);
                    break;
                case event.course.DELETE_COURSE:
                    await teacherCensorRepository.updateCourse(teacherInfo, courseInfo);
                    await adminCensorRepository.updateCourse(courseInfo, teacherInfo);
                    await adminCensorRepository.removeCourseToAdminCensor(courseInfo._id);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    assistantChanged: async(assistantInfo, courseInfo, assistantEvent)=>{
        try {
            switch(assistantEvent) {
                case event.assistant.EXPIRE_ASSISTANT_CONTRACT:
                    await teacherCensorRepository.cancelAssistant(courseInfo, assistantInfo)
                    break;
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventService;