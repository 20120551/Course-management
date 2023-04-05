const {courseRepository} = require('./../database');
const {
    FormatData
} = require('./../utils');

const courseService = {
    createCourse: async(courseInfo, teacherInfo)=> {
        try {
            const course = await courseRepository.createCourse(courseInfo, teacherInfo);
            return FormatData({course});
        } catch(err){
            throw err;
        }
    },
    updateCourse: async(courseInfo)=>{
        try {
            const course = await courseRepository.updateCourse(courseInfo);
            return FormatData({course});
        } catch(err){
            throw err;
        }
    },
    deleteCourse: async({id})=>{
        try {
            const course = await courseRepository.deleteCourse({id});
            return FormatData({course});
        } catch(err){
            throw err;
        }
    },
    destroyCourse: async({id})=>{
        try {
            const course = await courseRepository.destroyCourse({id});
            return FormatData({course});
        } catch(err){
            throw err;
        }
    },
    restoreCourse: async({id})=>{
        try {
            const course = await courseRepository.restoreCourse({id});
            return FormatData({course});
        } catch(err){
            throw err;
        }
    },

    createChapter: async({_id, name, lessons})=>{
        try {
            const {index, chapterInfo} = await courseRepository.addChapter({courseId: _id, name, lessons});
            return FormatData({chapterInfo, index});
        } catch(err){
            throw err;
        }
    },
    updateChapter: async({_id, index, name, lessons})=>{
        try {
            const chapterInfo = await courseRepository.updateChapter({courseId: _id, index, name, lessons});
            return FormatData({chapterInfo});
        } catch(err){
            throw err;
        }
    },
    deleteChapter: async({_id, index})=>{
        try {
            const chapterInfo = await courseRepository.deleteChapter({courseId: _id, index});
            return FormatData({chapterInfo});
        } catch(err) {
            throw err;
        }
    },
    getLesson: async({id, lessonId})=>{
        try {
            const lessonInfo = await courseRepository.getLesson({id, lessonId});
            return FormatData({lessonInfo});
        } catch(err){
            throw err;
        }
    },

    createLesson: async({lessons, index, id})=>{
        try {
            const lessonsInfo = await courseRepository.createLesson({lessons, index, id});
            return FormatData({lessonsInfo});
        } catch(err){
            throw err;
        }
    },
    updateLesson: async({lesson, lessonId})=>{
        try {
            const lessonInfo = await courseRepository.updateLesson({lesson, lessonId});
            return FormatData({lessonInfo});
        } catch(err){
            throw err;
        }
    },
    deleteLesson: async({id, lessonId, type})=>{
        try {
            await courseRepository.deleteLesson({id, lessonId, type});
        } catch(err){
            throw err;
        }
    },
    destroyLesson: async({id, lessonId, type})=>{
        try {
            await courseRepository.destroyLesson({id, lessonId, type});
        } catch(err){
            throw err;
        }
    },
    restoreLesson: async({id, lessonId, type})=>{
        try {
            await courseRepository.restoreLesson({id, lessonId, type});
        } catch(err){
            throw err;
        }
    },
    getAllCourses: async()=>{
        try {
            const courses = await courseRepository.getAllCourses();
            return FormatData({courses});
        } catch(err){
            throw err;
        }
    },
    getCourse: async(id)=>{
        try {
            const course = await courseRepository.getCourseById(id);
            return FormatData({course});
        } catch(err){
            throw err;
        }
    },
    requestRatingCourse: async(courseId, ratingInfo, userInfo)=>{
        try {
            const course = await courseRepository.requestRatingCourse(courseId, ratingInfo, userInfo);
            return FormatData({course});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = courseService;