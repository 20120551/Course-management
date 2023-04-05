const {Studying} = require('./../model');

const studyingRepository = {
    createDefaultProgress: async(userInfo)=>{
        const {
            _id,
            name,
            username
        } = userInfo;
        try {
            const studying = new Studying({
                user: {
                    _id,
                    name,
                    username
                }
            });

            const result = await studying.save();
            return result._doc || result;
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
            const studying = await Studying.findOneAndUpdate({'user._id': _id}, {
                $set: {
                    'user.name': name
                }
            })
            if(!studying) throw new Error('user does not exist!');
            return studying._doc || studying;
        } catch(err) {
            throw err;
        }
    },
    addCourseOnProgress: async(userInfo, coursesInfo)=>{
        const {
            _id: userId
        } = userInfo;
        try {
            const progress = await Studying.findOne({'user._id': userId});
            if(!progress) throw new Error('user does not exist!');

            const courses = await Promise.all(coursesInfo.map(async(course)=>{
                const {
                    _id,
                    name,
                    background,
                    subject,
                    description,
                    theme,
                    chapters,
                    expires
                } = course;

                //handle chapters to push to courses

                //push to progress
                progress.courses.push({
                    _id,
                    name,
                    background,
                    subject,
                    description,
                    startRolling: new Date(),
                    endCourse: new Date(new Date().setFullYear(new Date().getFullYear() + expires/365)),
                    theme: {
                        _id: theme._id,
                        name: theme.name
                    },
                    chapters
                })

                const data = progress.courses[progress.courses.length - 1];
                return {
                    ...data._doc
                };
            }));
            await progress.save();

            return courses._doc || courses;
        } catch(err) {
            throw err;
        }
    },
    deleteCourseFromProgress: async(userId, courseId)=>{
        try {
            await Studying.updateOne({'user._id': userId}, {
                $pull: {
                    courses: {
                        _id: courseId
                    }
                }
            });
        } catch(err) {
            throw err;
        }
    },
    findUserById: async(userId)=>{
        try {
            const user = await Studying.findOne({'user._id': userId});
            if(!user) throw new Error('user does not exist!');
            return user._doc || user;
        } catch(err) {
            throw err;
        }
    },
    getCourseById: async(userId, courseId)=>{
        try {
            const user = await Studying.findOne({'user._id': userId});
            if(!user) throw new Error('user does not exist!');
            const {courses} = user;

            const course = courses.find((course)=>course._id === courseId);
            return course._doc || course;
        } catch(err) {
            throw err;
        }
    },
    getLessonById: async(userId, courseId, lessonId)=>{
        try {
            const course = await studyingRepository.getCourseById(userId, courseId);
            const {chapters} = course;

            let lesson = null;
            for(const chapter of chapters) {
                const {lessons} = chapter;
                if(lesson = lessons.find((lesson)=>lesson._id === lessonId)){
                    return lesson;
                }
            }
            return null;
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
            await Studying.updateMany({}, {
                $push: {
                    'courses.$[course].chapters': {
                        name, 
                        totalTime
                    }
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'course._id': courseId
                }]
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
            await Studying.updateMany({}, {
                $set: {
                    [`courses.$[course].chapters.${index}.name`]: name,
                    [`courses.$[course].chapters.${index}.totalTime`]: totalTime,
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'course._id': courseId
                }]
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
            await Studying.updateMany({}, {
                $pull: {
                    [`courses.$[course].chapters`]: {
                        name: name
                    },
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'course._id': courseId
                }]
            })
        } catch(err) {
            throw err;
        }
    }
}

const handleLectureKind = {
    updatePersonalLesson: async(payload)=>{
        const {
            userId, courseId, lessonId, data
        } = payload;
        
        const {
            totalViewTime,
        } = data;
        try {
            const user = await Studying.findOne({'user._id': userId});

            if(!user) throw new Error('user does not exists!');
            
            const {courses} = user;

            const course = courses.find((course)=>course._id === courseId);

            if(!course) throw new Error('course does not exists!');
            const {chapters} = course;

            if(!chapters) throw new Error('this course does not have any chapters!');

            for(const chapter of chapters) {
                const {lessons} = chapter;
                const lesson = lessons.find((lesson)=>lesson._id === lessonId);

                if(lesson) {
                    lesson.totalViewTime = totalViewTime;
                    break;
                }
            }
            await user.save();
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
            background,
            code,
            description,
            isBlock,
            kind,
            totalTime
        } = data;
        try {
            await Studying.updateMany({}, {
                $push: {
                    [`courses.$[course].chapters.${index}.lessons`]: {
                        _id: lessonId,
                        name,
                        background,
                        code,
                        kind,
                        description,
                        isBlock,
                        totalTime
                    }
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'course._id': courseId,
                }]
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
            background,
            code,
            description,
            totalTime,
            deleted
        } = data;
        try {
            //use $eleMatch
            const users = await Studying.find({
                courses: {
                    $elemMatch: {
                        _id: courseId
                    }
                }
            });

            if(!users) throw new Error('course does not exists!');
            //update userInfo

            users.forEach(async(user)=>{
                const {courses} = user;

                const course = courses.find((course)=>course._id === courseId);

                if(!course) throw new Error('course does not exists!');
                const {chapters} = course;

                if(!chapters) throw new Error('this course does not have any chapters!');

                for(const chapter of chapters) {
                    const {lessons} = chapter;
                    const lesson = lessons.find((lesson)=>lesson._id === lessonId);

                    if(lesson) {
                        lesson.name = name || lesson.name;
                        lesson.isBlock = isBlock || lesson.isBlock;
                        lesson.background = background || lesson.background;
                        lesson.code = code || lesson.code;
                        lesson.description = description || lesson.description;
                        lesson.totalTime = totalTime || lesson.totalTime;
                        lesson.deleted = deleted || lesson.deleted;
                        break;
                    }
                }

                await user.save();
            })
        } catch(err) {
            throw err;
        }
    },
    destroyLesson: async(payload)=>{
        const {
            lessonId,
            courseId
        } = payload;
        try {
            await Studying.updateMany({}, {
                $pull: {
                    'courses.$[course].chapters.$[].lessons': {
                        _id: lessonId
                    }
                }
            }, {
               multi: true,
               arrayFilters: [{
                    'course._id': courseId,
               }] 
            })
        } catch(err) {
            throw err;
        }
    }
}

const handleExerciseKind = {
    autoMakeScore: async(payload)=>{
        const {
            userId, courseId, lessonId, data
        } = payload;
        const {
            state
        } = data;
        try {
            const user = await Studying.findOne({'user._id': userId});

            if(!user) throw new Error('user does not exists!');
            const {courses} = user;

            if(!courses) throw new Error('courses does not exists!');
            const course = courses.find((course)=>course._id === courseId);
            const {chapters} = course;

            if(!chapters) throw new Error('this course does not have any chapters!');
            for(const chapter of chapters) {
                const {lessons} = chapter;
                const lesson = lessons.find((lesson)=>lesson._id === lessonId);
                //update info
                if(lesson) {
                    //find score of lesson
                    const {questions} = lesson;
                    const length = questions.length;
                    const score = questions.reduce((prevValue, question)=>{
                        const {answers} = question;
                        const isCorrect = answers.every(answer=>answer.isChoose === answer.isResult);

                        console.log(isCorrect);
                        question.isCorrect = isCorrect;
                        //return value
                        if(!isCorrect) return prevValue + 0;
                        return prevValue + 1/length;
                    }, 0)
                    lesson.state = state;
                    lesson.score = score * 10;
                    break;
                }
            }
            await user.save();
        } catch(err) {
            throw err;
        }
    },
    updatePersonalLesson: async(payload)=>{
        const {
            userId, courseId, lessonId, data
        } = payload;
        
        //personalAnswers -> [{answers: [1,2], isCorrect: true}]
        const {
            score = 0,
            state,
            personalAnswers
        } = data;
        try {
            const user = await Studying.findOne({'user._id': userId});

            if(!user) throw new Error('user does not exists!');
            const {courses} = user;

            if(!courses) throw new Error('courses does not exists!');
            const course = courses.find((course)=>course._id === courseId);
            const {chapters} = course;

            if(!chapters) throw new Error('this course does not have any chapters!');
            for(const chapter of chapters) {
                const {lessons} = chapter;
                const lesson = lessons.find((lesson)=>lesson._id === lessonId);
                //update info
                if(lesson) {
                    lesson.score = score;
                    lesson.state = state;
    
                    if(!personalAnswers) break;

                    //update lesson 
                    const {questions} = lesson;
                    const temp = JSON.parse(personalAnswers);
                    questions.forEach((question, index)=>{
                        const {answers, isCorrect} = temp[index];
                        question.isCorrect = isCorrect;

                        if(!answers) return;
                        
                        answers.forEach((choice)=>{
                            question.answers[choice].isChoose = true
                        });
                    });
                    break;
                }
            }
            await user.save();
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
            kind,
            questions
        } = data;
        try {
            await Studying.updateMany({}, {
                $push: {
                    [`courses.$[course].chapters.${index}.lessons`]: {
                        _id: lessonId,
                        name,
                        isBlock,
                        timeComplete,
                        kind,
                        questions
                    }
                }   
            }, {
                multi: true,
                arrayFilters: [{
                    'course._id': courseId,
                }]
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
            deleted,
            rank
        } = data;
        try {
            //use $eleMatch
            const users = await Studying.find({
                courses: {
                    $elemMatch: {
                        _id: courseId
                    }
                }
            });

            if(!users) throw new Error('course does not exists!');
            //update userInfo

            users.forEach(async(user)=>{
                const {courses} = user;

                const course = courses.find((course)=>course._id === courseId);

                if(!course) throw new Error('course does not exists!');
                const {chapters} = course;

                if(!chapters) throw new Error('this course does not have any chapters!');

                for(const chapter of chapters) {
                    const {lessons} = chapter;
                    const lesson = lessons.find((lesson)=>lesson._id === lessonId);

                    if(lesson) {
                        lesson.name = name || lesson.name;
                        lesson.rank = rank || lesson.rank;
                        lesson.isBlock = isBlock || lesson.isBlock;
                        lesson.questions = questions || lesson.questions;
                        lesson.timeComplete = timeComplete || lesson.timeComplete;
                        lesson.deleted = deleted || lesson.deleted;
                        break;
                    }
                }

                await user.save();
            })
        } catch(err) {
            throw err;
        }
    },
    destroyLesson: async(payload)=>{
        const {
            lessonId,
            courseId
        } = payload;
        try {
            await Studying.updateMany({}, {
                $pull: {
                    'courses.$[course].chapters.$[].lessons': {
                        _id: lessonId
                    }
                }
            }, {
               multi: true,
               arrayFilters: [{
                    'course._id': courseId
               }] 
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = {
    handleLectureKind: handleLectureKind,
    handleExerciseKind: handleExerciseKind,
    studyingRepository: studyingRepository
}
