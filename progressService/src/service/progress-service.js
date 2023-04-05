const {teachingRepository, studyingRepository} = require('./../database');
const {
    FormatData,
    exportPDF
} = require('./../utils');
const {handleExerciseKind} = require('./../database/repository/studying-repository');
const {progressFactory} = require('./../pattern');

const progressService = {
    getCourse: async(userId, courseId)=>{
        try {
            const course = await studyingRepository.getCourseById(userId, courseId);
            return FormatData({course});
        } catch(err) {
            throw err;
        }
    },
    getLesson: async(userId, courseId, lessonId)=>{
        try {
            const lesson = await studyingRepository.getLessonById(userId, courseId, lessonId);
            return FormatData({lesson});
        } catch(err) {
            throw err;
        }
    },
    updatePersonalLesson: async(payload)=>{
        const {
            kind,
            ...data
        } = payload;
        try {
            const repository = progressFactory.createLessonByKind(kind);
            await repository.updatePersonalLesson(data);
        } catch(err) {
            throw err;
        }
    },
    downloadRankingPdfFile: async(payload)=>{
        try {
            const submits = await teachingRepository.findTotalSubmit(payload);
            exportPDF(submits);
            return FormatData({submits});
        } catch(err) {
            throw err;
        }
    },
    getAllSubmit: async(courseId)=>{
        try {
            const course = await teachingRepository.findCourseById(courseId);
            return FormatData({course});
        } catch(err) {
            throw err;
        }
    },
    getPersonalSubmit: async(courseId, lessonId, studentId)=>{
        try {
            const {
                _id,
                name,
                questions, 
                personalSubmit
            } = await teachingRepository.getPersonalSubmit(courseId, lessonId, studentId);
            return FormatData({
                exercise: {
                    _id, 
                    name
                },
                questions,
                personalSubmit
            })
        } catch(err) {
            throw err;
        }
    },
    makeScoreForStudent: async(payload)=>{
        try {
            await handleExerciseKind.updatePersonalLesson(payload);
            await teachingRepository.updatePersonalSubmit(payload);
            //check if total student is submit
            const submits = await teachingRepository.findTotalSubmit(payload);
            const isTotalScored = submits.every((submit)=>submit.isScored === true);

            if(isTotalScored) {
                await handleExerciseKind.updateLesson({
                    ...payload,
                    data: {
                        rank: 'rank.pdf'
                    }
                });
                return submits;
            }
            return null;
        } catch(err) {
            throw err;
        }
    },
    deleteCourseFromProgress: async(userId, courseId)=>{
        try {
            await studyingRepository.deleteCourseFromProgress(userId, courseId);
        } catch(err) {
            throw err;
        }
    },
}

module.exports = progressService;