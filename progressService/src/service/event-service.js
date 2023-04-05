const progressFactory = require('./../pattern/progress-factory');
const {teachingRepository, studyingRepository} = require('./../database');
const {
    FormatData
} = require('./../utils');
const {event} = require('./../constant');

const eventService = {
    accountChanged: async(userInfo, kind, userEvent)=>{
        try {
            const progress = progressFactory.createProgress(kind.toLowerCase());

            if(!progress) throw new Error('not support in this service!');
            switch(userEvent){
                case event.user.CREATE_ACCOUNT:
                    if(kind !== 'student') return;
                    await progress.createDefaultProgress(userInfo);
                    break;
                default:
                    await progress.updateAccount(userInfo);
                    break;
            }
        } catch(err){
            throw err;
        }
    },
    courseChanged: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            switch(courseEvent){
                case event.course.CREATE_COURSE:
                    await teachingRepository.createCourse(courseInfo); 
                    await teachingRepository.addEducatorToCourse(courseInfo, teacherInfo);
                    break;
                case event.course.DESTROY_COURSE:
                    await teachingRepository.destroyCourse(courseInfo); 
                    break;
                default:
                    await teachingRepository.updateCourse(courseInfo); 
                    break;
            }
        } catch(err){
            throw err;
        }
    },
    assistantChanged: async(assistantInfo, courseInfo, assistantEvent)=>{
        try {
            switch(assistantEvent){
                case event.assistant.ADD_ASSISTANT_TO_SERVICE:
                    await teachingRepository.addEducatorToCourse(courseInfo, assistantInfo);
                    break;
                case event.assistant.EXPIRE_ASSISTANT_CONTRACT:
                    await teachingRepository.expireAssistantContract(courseInfo._id, assistantInfo._id);
                    break;
            }
        } catch(err){
            throw err;
        }
    },
    addStudentToCourse: async(userInfo, coursesInfo)=>{
        try {
            const courses = await studyingRepository.addCourseOnProgress(userInfo, coursesInfo);
            return FormatData({courses});
        } catch(err){
            throw err;
        }
    },
    lessonChanged: async(courseId, lessonInfo, lessonEvent, index = null)=>{
        const {
            kind,
            _id: lessonId,
            ...data
        } = lessonInfo;
        try {
            const repository = progressFactory.createLessonByKind(kind.toLowerCase());
            const payload = {
                courseId,
                lessonId,
                data: {
                    ...data,
                    kind
                },
                index
            };

            if(!repository) throw new Error('not found this type!');

            switch(lessonEvent) {
                case    event.lecture.CREATE_LECTURE:
                    await repository.createLesson(payload);
                    break;
                case    event.lecture.UPDATE_LECTURE:
                case    event.lecture.DELETE_LECTURE:
                case    event.lecture.RESTORE_LECTURE:
                    await repository.updateLesson(payload);
                    break;
                case    event.lecture.DESTROY_LECTURE:
                    await repository.destroyLesson(payload);
                    break;
                case    event.exercise.CREATE_EXERCISE:
                    await repository.createLesson(payload);
                    await teachingRepository.createLesson(payload);
                    break;
                case    event.exercise.UPDATE_EXERCISE:
                case    event.exercise.DELETE_EXERCISE:
                case    event.exercise.RESTORE_EXERCISE:
                    await repository.updateLesson(payload);
                    await teachingRepository.updateLesson(payload);
                    break;
                case    event.exercise.DESTROY_EXERCISE:
                    await repository.destroyLesson(payload);
                    await teachingRepository.destroyLesson(payload);
                    break;
                default: 
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    chapterChanged: async(courseId, chapterInfo, chapterEvent, index = null)=>{
        try {
            const payload = {
                courseId,
                chapterInfo,
                index
            };
            switch(chapterEvent) {
                case event.chapter.CREATE_CHAPTER:
                    await studyingRepository.createChapter(payload);
                    await teachingRepository.createChapter(payload);
                    break;
                case event.chapter.UPDATE_CHAPTER:
                    await studyingRepository.updateChapter(payload);
                    await teachingRepository.updateChapter(payload);
                    break;
                case event.chapter.DESTROY_CHAPTER:
                    await studyingRepository.deleteChapter(payload);
                    await teachingRepository.deleteChapter(payload);
                    break;
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventService;