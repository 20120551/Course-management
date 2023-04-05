const {handleExerciseKind} = require('./../database/repository/studying-repository');
const {teachingRepository} = require('./../database');

const submitEventAdapter = {
    updatePersonalLesson: async(payload)=>{
        try {
            await handleExerciseKind.updatePersonalLesson(payload);

            const submitTime = new Date();
            const deadline = await teachingRepository.findExerciseDeadline(payload);

            if(submitTime > deadline) {
                await handleExerciseKind.autoMakeScore({
                    ...payload,
                    data: {
                        state: 'READY'
                    }
                })
            } else {
                await teachingRepository.submitExercise(payload);
            }
        } catch(err) {
            throw err;
        }
    },
    createLesson: async(payload)=>{
        try {
            await handleExerciseKind.createLesson(payload);
        } catch(err) {
            throw err;
        }
    },
    updateLesson: async(payload)=>{
        try {
            await handleExerciseKind.updateLesson(payload);
        } catch(err) {
            throw err;
        }
    },
    destroyLesson: async(payload)=>{
        try {
            await handleExerciseKind.destroyLesson(payload);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = submitEventAdapter;