const {Teaching} = require('./../model');

const teachingRepository = {
    findCourseById: async(courseId)=>{
        try {
            const course = await Teaching.findOne({_id: courseId});
            if(!course) throw new Error('course does not exist!');

            return course._doc || course;
        } catch(err) {
            throw err;
        }
    },
    getPersonalSubmit: async(courseId, lessonId, studentId)=>{
        try {
            const course = await teachingRepository.findCourseById(courseId);
            if(!course) throw new Error('course does not exist!');

            const {chapters} = course;
            if(!chapters) throw new Error('chapters does not exist!');

            for(const chapter of chapters){
                const {exercise} = chapter;
                const lesson = exercise.find((exe)=>exe._id === lessonId);

                if(lesson) {
                    const {submit, questions} = lesson;
                    const personalSubmit = submit.find((user)=>user._id === studentId);
                    if(questions && personalSubmit)
                    {
                        return {
                            _id: exercise._id,
                            name: exercise.name,
                            questions,
                            personalSubmit
                        }
                    }
                }
            }
            return null;
        } catch(err) {
            throw err;
        }
    },
    updateAccount: async(userInfo)=>{
        const {
            _id,
            name
        } = userInfo;
        try {
            await Teaching.updateMany({}, {
                $set: {
                    'educator.$[elem].name': name
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'elem._id': _id
                }]
            })
        } catch(err) {
            throw err;
        }
    },
    createCourse: async(courseInfo)=>{
        const {
            _id,
            name,
            background,
            subject
        } = courseInfo;
        try {
            const teaching = new Teaching({
                _id,
                name,
                background,
                subject
            })
            await teaching.save();
        } catch(err) {
            throw err;
        }
    },
    updateCourse: async(courseInfo)=>{
        const {
            _id,
            name,
            background,
            subject,
            state,
            deleted
        } = courseInfo;
        try {
            await Teaching.updateOne({_id: _id}, {
                $set: {
                    name,
                    background,
                    subject,
                    state,
                    deleted
                }
            })
        } catch(err) {
            throw err;
        }
    },
    destroyCourse: async(courseInfo)=>{
        const {
            _id,
        } = courseInfo;
        try {
            await Teaching.deleteOne({_id: _id});
        } catch(err) {
            throw err;
        }
    },
    addEducatorToCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id,
        } = courseInfo;
        const {
            _id: teacherId,
            name: teacherName
        } = teacherInfo;
        try {
            await Teaching.updateOne({_id: _id}, {
                $push: {
                    educator: {
                        _id: teacherId,
                        name: teacherName
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    expireAssistantContract: async(courseId, assistantId)=>{
        try {
            await Teaching.updateOne({_id: courseId}, {
                $pull: {
                    educator: {
                        _id: assistantId
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    findExerciseDeadline: async(payload)=>{
        const {
            courseId, lessonId
        } = payload;
        try {
            const course = await Teaching.findOne({_id: courseId});
            if(!course) throw new Error('course does not exist!');

            const {chapters} = course;
            if(!chapters) throw new Error('chapters does not exist!');

            for(const chapter of chapters) {
                const {exercise} = chapter;
                const exe = exercise.find((exercise)=>exercise._id === lessonId);
                if(exe) {
                    return exe.deadline;
                }
            }
            return null;
        } catch(err) {
            throw err;
        }
    },
    findTotalSubmit: async(payload)=>{
        const {
            courseId, lessonId
        } = payload;
        try {
            const course = await Teaching.findOne({_id: courseId});
            if(!course) throw new Error('course does not exist!');

            const {chapters} = course;
            if(!chapters) throw new Error('chapters does not exist!');

            for(const chapter of chapters) {
                const {exercise} = chapter;
                const exe = exercise.find((exercise)=>exercise._id === lessonId);
                if(exe) {
                    return exe.submit;
                }
            }
            return null;
        } catch(err) {
            throw err;
        }
    },
    submitExercise: async(payload)=>{
        const {
            courseId,
            userId,
            name,
            username,
            lessonId,
            data
        } = payload;
        const {
            timeComplete,
            personalAnswers
        } = data;
        try {
            const answers = JSON.parse(personalAnswers).map((per)=>{
                return per.answers;
            })

            await Teaching.updateOne({_id: courseId}, {
                $push: {
                    'chapters.$[].exercise.$[elem].submit': {
                        _id: userId,
                        name,
                        timeSubmit: timeComplete,
                        answers,
                        username
                    }
                }
            }, {
                arrayFilters: [{
                    'elem._id': lessonId
                }]
            })
        } catch(err) {
            throw err;
        }
    },
    updatePersonalSubmit: async(payload)=>{
        const {
            courseId,
            userId,
            lessonId,
            data
        } = payload;
        const {
            score
        } = data;
        try {
            await Teaching.updateOne({_id: courseId}, {
                $set: {
                    'chapters.$[].exercise.$[elem].submit.$[user].score': score,
                    'chapters.$[].exercise.$[elem].submit.$[user].isScored': true,
                }
            }, {
                arrayFilters: [{
                    'elem._id': lessonId,
                }, {
                    'user._id': userId
                }]
            })
        } catch(err) {
            throw err;
        }
    },
    createLesson: async(payload)=>{
        const {
            courseId,
            lessonId,
            index,
            data
        } = payload;

        const {
            name,
            isBlock,
            timeComplete,
            questions
        } = data;
        try {
            await Teaching.updateOne({_id: courseId}, {
                $push: {
                    [`chapters.${index}.exercise`]: {
                        _id: lessonId,
                        name,
                        isBlock,
                        timeComplete,
                        questions
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    updateLesson: async(payload)=>{
        const {
            courseId, lessonId, data
        } = payload;

        const {
            name,
            isBlock,
            questions,
            timeComplete,
            deleted
        } = data;
        try {
            await Teaching.updateOne({_id: courseId}, {
                $set: {
                    'chapters.$[].exercise.$[elm].name': name,
                    'chapters.$[].exercise.$[elm].isBlock': isBlock,
                    'chapters.$[].exercise.$[elm].questions': questions,
                    'chapters.$[].exercise.$[elm].timeComplete': timeComplete,
                    'chapters.$[].exercise.$[elm].deleted': deleted,
                }
            }, {
                arrayFilters: [{
                    'elm._id': lessonId
                }],
            })
        } catch(err) {
            throw err;
        }
    },
    destroyLesson: async(payload)=>{
        const {
            courseId, 
            lessonId
        } = payload;
        try {
            await Teaching.updateOne({_id: courseId}, {
                $pull: {
                    'chapters.$[].exercise': {
                        _id: lessonId
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    createChapter: async(payload)=>{
        const {
            courseId,
            chapterInfo,
        } = payload;
        const {
            name,
            totalTime
        } = chapterInfo;
        try {
            await Teaching.updateOne({_id: courseId}, {
                $push: {
                    chapters: {
                        name,
                        totalTime
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    updateChapter: async(payload)=>{
        const {
            courseId,
            chapterInfo,
            index,
        } = payload;
        const {
            name,
            totalTime
        } = chapterInfo;
        try {
            await Teaching.updateOne({_id: courseId}, {
                $set: {
                    [`chapters.${index}.name`]: name,
                    [`chapters.${index}.totalTime`]: totalTime,
                }
            })
        } catch(err) {
            throw err;
        }
    },
    deleteChapter: async(payload)=>{
        const {
            courseId,
            chapterInfo,
            index,
        } = payload;
        const {
            name,
        } = chapterInfo;
        try {
            await Teaching.updateOne({_id: courseId}, {
                $pull: {
                    chapters: {
                        name: name
                    },
                }
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = teachingRepository;
