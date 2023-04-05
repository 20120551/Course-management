const {studyingRepository, teachingRepository} = require('../database')
const {handleLectureKind} = require('./../database/repository/studying-repository');
const handleExerciseKind = require('./submitEvent-Adapter');

const progressFactory = {
    createProgress: (kind)=>{
        switch(kind){
            case "student":
                return studyingRepository;
            case "educator":
                return teachingRepository;
            default:
                return null;
        }
    },
    createLessonByKind: (kind)=>{
        switch(kind) {
            case "lecture":
                return handleLectureKind;
            case "exercise": 
                return handleExerciseKind;
            default:
                return null;
        }
    }
}

module.exports = progressFactory;