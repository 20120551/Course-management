const {teacherCensorRepository, adminCensorRepository} = require('./../database');
const {FormatData} = require('./../utils');
const {event} = require('./../constant');
const createMailTemplate = require('./../pattern/factory-createMailTemplate');
const {mg, transporter} = require('./../lib');

const censorService = {
    getAllAssistantRequest: async(courseId, teacherId)=>{
        try {
            const course = await teacherCensorRepository.findCourseById(courseId, teacherId);
            await teacherCensorRepository.updateNewInTeacherCensor(courseId, 'assistant');
            return FormatData({course});
        } catch(err) {
            throw err;
        }
    },
    updateAssistantState: async(courseId, teacherId, assistantId, state)=>{
        try {
            const status = {
                state
            };
            if(`${state}_STATE` === event.assistant_state.APPROVE_STATE){
                status.startJoiningTime = new Date();
                status.endJoiningTime = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            }

            await teacherCensorRepository.updateAssistantState(courseId, teacherId, assistantId, status);
            const courseInfo = await teacherCensorRepository.findCourseById(courseId, teacherId);
            const assistantInfo = await teacherCensorRepository.findAssistantById(courseId, teacherId, assistantId);

            //send mail for assistant
            const template = createMailTemplate.createTemplateMail(state);
            const {data} = template(assistantInfo.username, {courseInfo: courseInfo, assistantInfo: assistantInfo});
            //await mg.messages().send(data);
            await transporter.sendMail(data);

            return FormatData({assistantInfo});
        } catch(err){
            throw err;
        }
    },
    cancelAssistantRequest: async(courseId, teacherId, assistantId)=>{
        try {
            const assistantInfo = await teacherCensorRepository.findAssistantById(courseId, teacherId, assistantId);
            await teacherCensorRepository.cancelAssistant({_id: courseId}, {_id: assistantId});
            const courseInfo = await teacherCensorRepository.findCourseById(courseId, teacherId);

            //send mail for assistant
            const template = createMailTemplate.createTemplateMail('REJECT');
            const {data} = template(assistantInfo.username, {courseInfo: courseInfo});

            //await mg.messages().send(data);
            await transporter.sendMail(data);

            return FormatData({assistantInfo});
        } catch(err) {
            throw err;
        }
    },
    getAllRatingRequest: async(courseId, teacherId)=>{
        try {
            const course = await teacherCensorRepository.findCourseById(courseId, teacherId);
            await teacherCensorRepository.updateNewInTeacherCensor(courseId, 'rating');
            return FormatData({course});
        } catch(err) {
            throw err;
        }
    },
    updateRatingState: async(courseId, studentId, ratingData)=>{
        try {
            await teacherCensorRepository.updateRatingState(courseId, studentId, ratingData);
        } catch(err){
            throw err;
        }
    },
    cancelRatingRequest: async(courseId, studentId)=>{
        try {
            await teacherCensorRepository.cancelRating({_id: courseId}, {_id: studentId});
        } catch(err) {
            throw err;
        }
    },
    getAllCoursesRequest: async(state)=>{
        try {
            const courses = await adminCensorRepository.getAllCoursesRequest(state);
            await adminCensorRepository.updateNewInAdminCensor(state);
            return FormatData({courses});
        } catch(err) {
            throw err;
        }
    },
    getPersonalCourse: async(adminId)=>{
        try {
            const courses = await adminCensorRepository.getAcceptableCourse(adminId);
            return FormatData({courses});
        } catch(err) {
            throw err;
        }
    },
    updateCourseState: async(adminId, courseInfo)=>{
        try {
            const course = await adminCensorRepository.updateCourse(courseInfo);
            await adminCensorRepository.addCourseToAdminCensor(courseInfo._id, adminId);
            return FormatData({course});
        } catch(err) {
            throw err;
        }
    },
    cancelCourseRequest: async(courseInfo)=>{
        try {
            const course = await adminCensorRepository.updateCourse(courseInfo);
            return FormatData({course});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = censorService;