const {courseRepository} = require('./../database');
const {event} = require('./../constant');
const {FormatData} = require('./../utils');

const eventService = {
    accountChanged: async({userEvent, user})=>{
        try {
            switch(userEvent) {
                case event.user.TEACHER_UPDATED:
                    await courseRepository.updateTeacherProfile(user);
                    break;
                case event.user.ASSISTANCE_UPDATED:
                    await courseRepository.updateAssistantProfile(user);
                    break;
                case event.user.STUDENT_UPDATED:
                    await courseRepository.updateStudentProfile(user);
                    break;
                //...add field for this
            }
        } catch(err) {
            throw err;
        }
    },
    enrollCourses: async(cartInfo, userInfo)=>{
        try {
            const courses = await Promise.all(cartInfo.items.map(async(cart)=>{
                const courseInfo = await courseRepository.enrollCourse(cart._id, userInfo);
                return {...courseInfo}
            }));
            return FormatData({courses});
        } catch(err) {
            throw err;
        }
    },
    assistantChanged: async(assistantInfo, courseInfo, assistantEvent)=>{
        try {
            switch(assistantEvent) {
                case event.assistant.ADD_ASSISTANT_TO_SERVICE:
                    await courseRepository.createAssistant(courseInfo._id, assistantInfo);
                    break;
                case event.assistant.EXPIRE_ASSISTANT_CONTRACT:
                    await courseRepository.expireAssistantContract(courseInfo._id, assistantInfo._id);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    ratingStateChanged: async(userId, courseId, ratingData, ratingEvent)=>{
        try {
            switch(ratingEvent) {
                case event.rating_state.APPROVE_STATE:
                    await courseRepository.updateRating(courseId, userId, ratingData);
                    break;
                case event.rating_state.REJECT_STATE:
                    await courseRepository.cancelRating(courseId, userId);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    courseStateChanged: async(courseInfo, courseEvent)=>{
        try {
            let course = null;
            switch(courseEvent) {
                case event.course.UPDATE_COURSE:
                    course = await courseRepository.updateCourse(courseInfo);
                    return FormatData({course});
                case event.course.DELETE_COURSE:
                    await courseRepository.updateCourse(courseInfo);
                    course = await courseRepository.deleteCourse({id: courseInfo._id});
                    return FormatData({course});
            }
        } catch(err) {
            throw err;
        }
    },
    progressChanged: async(courseInfo, userInfo, progressEvent)=>{
        try {
            switch(progressEvent) {
                case event.progress.EXPIRE_COURSE_IN_PROGRESS:
                    await courseRepository.deleteStudentFromCourse(userInfo._id, courseInfo._id);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
}

module.exports = eventService;