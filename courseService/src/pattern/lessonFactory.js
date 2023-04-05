const exerciseRepository = require('./../database/repository/exercise-repository');
const lectureRepository = require('./../database/repository/lecture-repository');

const lessonFactory = {
    createLesson: (type)=>{
        switch(type) {
            case 'EXERCISE':
                return exerciseRepository;
            case 'LECTURE':
                return lectureRepository;
        }
    }
}

module.exports = lessonFactory;