const {Course} = require('./../model');
const lessonFactory = require('./../../pattern/lessonFactory');

const courseRepository = {
    createCourse: async(courseInfo, teacherInfo)=>{
        const {
            name: courseName,
            background,
            subject,
            expires,
            description: courseDes,
            price,
            themeId,
        } = courseInfo;

        try {
            const course = new Course({
                name: courseName,
                background,
                subject,
                expires,
                theme: themeId,
                description: JSON.parse(courseDes),
                price,
                teacher: teacherInfo,
                assistance: [],
                rating: [],
            })
            const result = await course.save().then(t=> t.populate('theme'));
            return result._doc || result;
        } catch(err){
            throw err;
        }
    },
    updateCourse: async(courseInfo)=>{
        const {
            _id: courseId,
            name: courseName,
            background,
            subject,
            expires,
            price,
            description: courseDes,
            themeId,
            state,
        } = courseInfo;

        try {
            const result = await Course.findOneAndUpdate({_id: courseId}, {
                name: courseName,
                background,
                subject,
                expires,
                description: courseDes,
                themeId,
                price,
                state
            }, { new: true }).populate('theme');
            if(!result) throw new Error('course does not exist!');

            return result._doc || result;
        } catch(err) {
            throw err;
        } 
    },
    deleteCourse: async({id})=>{
        try {
            await Course.delete({_id: id});

            //get data after deleted
            const course = await Course.findOne({_id: id});
            if(!course) throw new Error('course does not exist!');

            return course._doc || course;
        } catch(err) {
            throw err;
        } 
    },
    destroyCourse: async({id})=>{
        try {
            //get data before deleted
            const course =  await Course.findOne({_id: id})
            if(!course) throw new Error('course does not exist!');

            await Course.deleteOne({_id: id});

            return course._doc || course;
        } catch(err) {
            throw err;
        } 
    },
    restoreCourse: async({id})=>{
        try {
            await Course.restore({_id: id});
            const course =  await Course.findOne({_id: id})
            if(!course) throw new Error('course does not exist!');
            
            return course._doc || course;
        } catch(err) {
            throw err;
        }
    },
    findCourseById: async(id)=>{
        try {
            const course = await Course.findOne({_id: id});
            if(!course) throw new Error('course does not exist!');
            
            return course._doc || course;
        } catch(err) {
            throw err;
        }
    },
    enrollCourse: async(id, userInfo)=>{
        try {
            const course = await Course.findById({_id: id}).populate('theme');
            if(!course) throw new Error('course does not exist!');

            const {totalStudent, chapters, ...courseInfo} = course;

            //add student into course
            totalStudent.push({
                _id: userInfo._id,
                name: userInfo.name,
                image: userInfo.image
            })
            await course.save();        

            //Format data to send to progress service
            const chapterInfo = await chapterHandler.getChaptersInfo(chapters);

            courseInfo.chapters = chapterInfo;
            return courseInfo._doc || courseInfo;
        } catch(err) {
            throw err;
        }
    },

    addChapter: async({courseId, name, lessons})=> {
        try {
            const lessonIds = await Promise.all(lessons.map(async(les)=>{
                const {type, ...payload} = les;
                const lessonRepository = lessonFactory.createLesson(type.toUpperCase());

                const {_id} = await lessonRepository.createLesson(payload);
                return {
                    kind: type.toLowerCase(),
                    _id
                };
            }))

            const course = await Course.findById({_id: courseId});
            if(!course) throw new Error('course does not exist!');

            course.chapters.push({
                name,
                lessons: [...lessonIds]
            });

            await course.save();
            const index = course.chapters.length - 1;
            const chapter = course.chapters[index];
            //parse data in chapter
            const chapterInfo = await chapterHandler.getChapterInfo(chapter);
            return {
                chapterInfo,
                index
            };
        } catch(err){
            throw err;
        }
    },
    updateChapter: async({courseId, index, name, lessons})=>{
        try {
            const lessonIds = await Promise.all(lessons.map(async(les)=>{
                const {type, ...payload} = les;
                const lessonRepository = lessonFactory.createLesson(type.toUpperCase());

                const {_id} = await lessonRepository.updateLesson(payload);

                return {
                    kind: type.toLowerCase(),
                    _id
                };
            }))

            const course = await Course.findById({_id: courseId});
            if(!course) throw new Error('course does not exist!');

            //update chapters
            course.chapters[index] = {
                name,
                lessons: [...lessonIds]
            }

            await course.save();

            const chapterInfo = await chapterHandler.getChapterInfo(course.chapters[index]);
            return chapterInfo;
        } catch(err){
            throw err;
        }
    },
    deleteChapter: async({courseId, index})=>{
        try {
            const course = await Course.findOne({_id: courseId});
            if(!course) throw new Error('course does not exist!');

            const {chapters} = course;

            const chapter = chapters[index];
            const chapterInfo = await chapterHandler.getChapterInfo(chapter);

            //delete chapter
            chapters.splice(index, 1);

            const {lessons} = chapter;
            //delete lessonInfo
            lessons.forEach(async(les)=>{
                const {kind, _id} = les;
                const lessonRepository = lessonFactory.createLesson(kind.toUpperCase());

                await lessonRepository.destroyLesson({lessonId: _id});
            })

            await course.save();
            return chapterInfo;
        } catch(err){
            throw err;
        }
    },
    updateTeacherProfile: async(user)=>{
        const {
            _id,
            name,
            image,
            description
        } = user;
        try {
            await Course.updateMany({'teacher._id': _id},{
                'teacher.name': name,
                'teacher.image': image,
                'teacher.description': description,
            });

        } catch(err){
            throw err;
        }
    },
    updateStudentProfile: async(user)=>{
        const {
            _id,
            name,
            image
        } = user;

        try {
            await Course.updateMany({}, {
                $set: {
                    'totalStudent.$[elm].name': name,
                    'totalStudent.$[elm].image': image,
                },

            }, {
                multi: true,
                arrayFilters: [{
                    'elm._id': _id
                }]
            })

            await Course.updateMany({}, {
                $set: {
                    'rating.$[elm].student.name': name,
                    'rating.$[elm].student.image': image,
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'elm.student._id': _id
                }]
            })
        } catch(err) {
            throw err;
        }
    },

    updateAssistantProfile: async(user)=>{
        const {
            _id,
            name,
            image
        } = user;
        try {
            await Course.updateMany({}, {
                $set: {
                    'assistant.$[elm].name': name,
                    'assistant.$[elm].image': image,
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'elm.student._id': _id
                }]
            })
        } catch(err) {
            throw err;
        }
    },
    getLesson: async({lessonId, id})=>{
        try {
            const course = await Course.findOne({_id: id});
            if(!course) throw new Error('course does not exist!');

            const {chapters} = course;
            
            for(const chapter of chapters) {
                const {lessons} = chapter;
                const lesson = lessons.find((lesson)=>lesson._id == lessonId);

                if(lesson) {
                    const {
                        kind,
                        _id
                    } = lesson;
                    const lessonInfo = await chapterHandler.getLessonInfo(_id, kind);
                    return lessonInfo;
                }
            }
            return null;
        } catch(err) {
            throw err;
        }
    },
    createLesson: async({lessons, index, id})=>{
        try {
            const lessonsIds = await Promise.all(lessons.map(async(les)=>{
                const {type, ...payload} = les;
                const lessonRepository = lessonFactory.createLesson(type.toUpperCase());

                const {_id} = await lessonRepository.createLesson(payload);

                return {
                    kind: type.toLowerCase(),
                    _id
                };
            }))

            const course = await Course.findById({_id: id});
            if(!course) throw new Error('course does not exist!');

            course.chapters[index].lessons.push(...lessonsIds);

            await course.save();

            const lessonsInfo = await chapterHandler.getLessonsInfo(lessonsIds);
            return lessonsInfo;
        } catch(err){
            throw err;
        }
    },
    updateLesson: async({lesson, lessonId})=>{
        try {
            const {type, ...payload} = lesson;

            const lessonRepository = lessonFactory.createLesson(type.toUpperCase());

            await lessonRepository.updateLesson({
                _id: lessonId,
                ...payload,
            });

            const lessonInfo = await chapterHandler.getLessonInfo(lessonId, type);
            return lessonInfo;
        } catch(err){
            throw err;
        }
    },
    deleteLesson: async({id, lessonId, type})=>{
        try {
            const lessonRepository = lessonFactory.createLesson(type.toUpperCase());
            await lessonRepository.deleteLesson({lessonId});
        } catch(err) {
            throw err;
        }
    },
    destroyLesson: async({id, lessonId, type})=>{
        try {
            const lessonRepository = lessonFactory.createLesson(type.toUpperCase());
            //delete lessons by id
            const course = await Course.findById({_id: id});
            if(!course) throw new Error('course does not exist!');

            const {chapters} = course;

            //delete in course first
            chapters.forEach((chapter)=>{
                let index = chapter.lessons.findIndex(lesson=>lesson._id == lessonId)

                if(index !== -1) {
                    return chapter.lessons.splice(index, 1);
                }
            })
            
            //delete in lesson model
            await lessonRepository.destroyLesson({lessonId});
            await course.save();
        } catch(err) {
            throw err;
        }
    },
    restoreLesson: async({id, lessonId, type})=>{
        try {
            const lessonRepository = lessonFactory.createLesson(type.toUpperCase());
            await lessonRepository.restoreLesson({lessonId});
        } catch(err) {
            throw err;
        }
    },
    getAllCourses: async()=>{
        try {
            const courses = await Course.find({});
            if(!courses) throw new Error('course does not exist!');

            return courses;
        } catch(err) {
            throw err;
        }
    },
    getCourseById: async(id)=>{
        try {
            const course = await Course.findById({_id: id}).populate('theme');
            if(!course) throw new Error('course does not exist!');

            return course._doc || course;
        } catch(err) {
            throw err;
        }
    },
    createAssistant: async(courseId, userInfo)=>{
        const {
            _id,
            username,
            name,
            image,
            startJoiningTime,
            endJoiningTime
        } = userInfo;
        try {
            const course = await Course.findOneAndUpdate({_id: courseId}, {
                $push: {
                    assistant: {
                        _id,
                        username,
                        name,
                        image,
                        startJoiningTime,
                        endJoiningTime
                    }
                }
            }, {new: true});
            if(!course) throw new Error('course does not exist!');
            
            return course._doc || course;
        } catch(err) {
            throw err;
        }
    },
    expireAssistantContract: async(courseId, userId)=>{
        try {
            const course = await Course.findOneAndUpdate({_id: courseId}, {
                $pull: {
                    assistant: {
                        _id: userId
                    }
                }
            });
            if(!course) throw new Error('course does not exist!');

            return course._doc || course;
        } catch(err) {
            throw err;
        }
    },
    requestRatingCourse: async(courseId, ratingInfo, userInfo)=>{
        const {
            _id,
            name,
            image
        } = userInfo;

        const {
            rate,
            content
        } = ratingInfo;
        try {
            const course = await Course.findOneAndUpdate({_id: courseId}, {
                $push: {
                    rating: {
                        student: {
                            _id,
                            name,
                            image 
                        },
                        rate,
                        content
                    }
                }
            })
            if(!course) throw new Error('course does not exist!');
            
            return course._doc || course;
        } catch(err){
            throw err;
        }
    },
    cancelRating: async(courseId, userId)=>{
        try {
            await Course.updateOne({_id: courseId}, {
                $pull: {
                    rating: {
                        'student._id': userId
                    }
                }
            });
        } catch(err) {
            throw err;
        }
    },
    updateRating: async(courseId, userId, ratingData)=>{
        const {
            state,
            ratingDate
        } = ratingData;
        try {
            await Course.updateOne({_id: courseId, rating: {
                $elemMatch: {
                    'student._id': userId
                }
            }},{
                $set: {
                    'rating.$.state': state,
                    'rating.$.ratingDate': ratingDate,
                }
            })
        } catch(err) {
            throw err;
        }
    },
    deleteStudentFromCourse: async(userId, courseId)=>{
        try {
            await Course.updateOne({_id: courseId}, {
                $pull: {
                    totalStudent: {
                        _id: userId
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    }
}

const chapterHandler = {
    getChaptersInfo: async(chapters)=>{
        try {
            const chapterInfo = await Promise.all(chapters.map(async(chapter)=>{
                const {
                    name,
                    totalView,
                    lessons
                } = chapter;
                const lessonsInfo = await Promise.all(lessons.map(async(lesson)=>{
                    const {
                        _id,
                        kind
                    } = lesson;
        
                    const lessonRepository = lessonFactory.createLesson(kind.toUpperCase());
                    const data = await lessonRepository.findLessonById(_id);
        
        
                    return {...data, kind};
                }))
        
                return {
                    name,
                    totalView,
                    lessons: lessonsInfo
                }
            }));
            return chapterInfo;
        } catch(err) {
            throw err;
        }
    },
    getChapterInfo: async(chapter)=>{
        try {
            const {
                name,
                totalView,
                lessons
            } = chapter;
            const lessonsInfo = await Promise.all(lessons.map(async(lesson)=>{
                const {
                    _id,
                    kind
                } = lesson;

                const lessonRepository = lessonFactory.createLesson(kind.toUpperCase());
                const data = await lessonRepository.findLessonById(_id);
                return {...data, kind};
            }))

            return {
                name,
                totalView,
                lessons: lessonsInfo
            }
        } catch(err) {
            throw err;
        }
    },
    getLessonsInfo: async(lessons)=>{
        try {
            const lessonsInfo = await Promise.all(lessons.map(async(lesson)=>{
                const {
                    _id,
                    kind
                } = lesson;

                const lessonRepository = lessonFactory.createLesson(kind.toUpperCase());
                const data = await lessonRepository.findLessonById(_id);


                return {...data, kind};
            }))
            return lessonsInfo;
        } catch(err) {
            throw err;
        }
    },
    getLessonInfo: async(lessonId, kind)=>{
        try {
            const lessonRepository = lessonFactory.createLesson(kind.toUpperCase());
            const data = await lessonRepository.findLessonById(lessonId);
            return {...data, kind};
        } catch(err) {
            throw err;
        }
    }
}

module.exports = courseRepository;