const exerciseModel = require('../model/exercise-model');
const {Exercise} = require('./../model');
const questionRepository = require('./question-repository');

const exerciseRepository = {
    createLesson: async(payload)=>{
        const {
            questions,
            isBlock = true
        } = payload;

        try {
            //create question
            const questionIds = await Promise.all(questions.map(async(ques)=>{
                const {question, answers} = ques;
                const {_id} = await questionRepository.createQuestion({
                    question,
                    answers
                })
                return _id;
            }))

            //create exercise
            const exercise = new Exercise({
                questions: [...questionIds],
                isBlock
            })
            const result = await exercise.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },

    updateLesson: async(payload)=>{
        const {
            _id,
            questions,
            isBlock
        } = payload;
        try {
            const result = await Exercise.findOneAndUpdate({_id: _id}, {isBlock})
            if(!result) throw new Error('exercise does not exist');

            await Promise.all(questions.map(async(ques, index)=>{
                const {question, answers} = ques;

                await questionRepository.updateQuestion({
                    _id: result.questions[index]._id,
                    question,
                    answers
                })
            }))

            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    deleteLesson: async(payload)=>{
        const {
            lessonId,
        } = payload;
        try {   
            await Exercise.delete({_id: lessonId});
        } catch(err) {
            throw err;
        }
    },
    destroyLesson: async(payload)=>{
        const {
            lessonId,
        } = payload;
        try {
            const question = await Exercise.findOne({_id: lessonId}).populate('questions');
            if(!question) throw new Error('exercise does not exist');

            await Exercise.deleteOne({_id: lessonId});

            const {questions} = question;

            if(!questions) throw new Error('questions does not exist!');

            await questionRepository.deleteQuestion({questionIds: questions});
        } catch(err) {
            throw err;
        }
    },
    restoreLesson: async(payload)=>{
        const {
            lessonId
        } = payload;
        try {
            await Exercise.restore({_id: lessonId});
        } catch(err) {
            throw err;
        }
    },
    findLessonById: async(_id)=>{
        try {
            const exercise = await Exercise.findById({_id: _id}).populate('questions');
            if(!exercise) throw new Error('exercise does not exist');

            return exercise._doc || exercise;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = exerciseRepository;