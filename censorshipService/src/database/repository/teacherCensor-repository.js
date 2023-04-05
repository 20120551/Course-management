const {TeacherCensor} = require('./../model');

const teacherCensorRepository = {
    createCensor: async(user)=>{
        const {
            _id,
            name,
            username,
            image,
        } = user;
        try {
            const censor = new TeacherCensor({
                teacher: {
                    _id,
                    name,
                    username,
                    image
                }
            })

            await censor.save();
        } catch(err) {
           throw err;
        }   
    },
    updateProfile: async(user)=>{
        const {
            _id,
            name,
            username,
            image,
        } = user;
        try {
            await TeacherCensor.updateOne({'teacher._id': _id}, {
                $set: {
                    'teacher.name': name,
                    'teacher.username':username,
                    'teacher.image':image
                }
            })
        } catch(err) {
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
            await TeacherCensor.updateMany({}, {
                $set: {
                    'courseCensor.$[].rating.$[elm].student.name': name,
                    'courseCensor.$[].rating.$[elm].student.image': image,
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'elm.student._id': _id,
                }]
            })
        } catch(err) {
           throw err;
        }
    },
    createCourse: async(teacherInfo, courseInfo)=>{
        const {
            _id,
            name,
            subject,
            deleted,
            state
        } = courseInfo;
        const {_id: teacherId} = teacherInfo;
        try {
            await TeacherCensor.updateOne({'teacher._id': teacherId}, {
                $push: {
                    courseCensor: {
                        _id,
                        name,
                        subject,
                        deleted,
                        state
                    }
                }
            })
        } catch(err) {
           throw err;
        }
    },
    updateCourse: async(teacherInfo, courseInfo)=>{
        const {
            _id,
            name,
            subject,
            deleted,
            state
        } = courseInfo;
        const {_id: teacherId} = teacherInfo;
        try {
            await TeacherCensor.updateOne({'teacher._id': teacherId}, {
                $set: {
                    'courseCensor.$[elm].name': name,
                    'courseCensor.$[elm].subject': subject,
                    'courseCensor.$[elm].deleted': deleted,
                    'courseCensor.$[elm].state': state,
                }
            }, {
                arrayFilters: [{
                    'elm._id': _id
                }]
            })
        } catch(err) {
           throw err;
        }
    },
    destroyCourse: async(teacherInfo, courseInfo)=>{
        const {
            _id,
        } = courseInfo;
        const {_id: teacherId} = teacherInfo;
        try {
            await TeacherCensor.updateOne({'teacher._id': teacherId}, {
                $pull: {
                    courseCensor: {
                        _id: _id
                    }
                }
            })
        } catch(err) {
           throw err;
        }
    },
    findCourseById: async(courseId, teacherId)=>{
        try {
            const {courseCensor} = await TeacherCensor.findOne({'teacher._id': teacherId});
            if(!courseCensor) 
                throw new Error('teacher Id does not matching!')

            const course = courseCensor.find((course)=>course._id === courseId);
            
            if(!course) throw new Error('this course does not exist!')

            return course._doc || course;
        } catch(err) {
           throw err;
        }
    },
    findAssistantById: async(courseId, teacherId, assistantId)=>{
        try {
            const course = await teacherCensorRepository.findCourseById(courseId, teacherId);
            if(!course) throw new Error('this course does not exist!');

            const {assistant} = course;

            const assistantInfo = assistant.find((ass)=>ass._id === assistantId);
            if(!assistantInfo) throw new Error('assistant Id does not matching!');

            return assistantInfo._doc || assistantInfo;
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
            await TeacherCensor.updateMany({}, {
                $set: {
                    'courseCensor.$[].assistant.$[elm].student.name': name,
                    'courseCensor.$[].assistant.$[elm].student.image': image,
                }
            }, {
                multi: true,
                arrayFilters: [{
                    'elm._id': _id
                }]
            })
        } catch(err) {
           throw err;
        }
    },
    createAssistant: async(courseInfo, userInfo, message)=>{
        const {
            _id: courseId,
        } = courseInfo;
        const {
            _id: userId,
            username,
            image,
            name
        } = userInfo;
        try {
            await TeacherCensor.updateOne({
                courseCensor: {
                    $elemMatch: {
                        _id: courseId
                    }
                }
            }, {
                $push: {
                    'courseCensor.$.assistant': {
                        _id: userId,
                        username,
                        image,
                        name,
                        message
                    }
                }
            });
        } catch(err) {
           throw err;
        }
    },
    updateNewInTeacherCensor: async(courseId, type)=>{
        try {
            await TeacherCensor.updateOne({
                courseCensor: {
                    $elemMatch: {
                        _id: courseId
                    }
                }
            },{
                $set: {
                    [`courseCensor.$.${type}.$[].new`]: false
                }
            })
        } catch(err) {
           throw err;
        }
    },
    cancelAssistant: async(courseInfo, userInfo)=>{
        const {_id: courseId} = courseInfo;
        const {_id: userId} = userInfo;
        try {
            await TeacherCensor.updateOne({
                courseCensor: {
                    $elemMatch: {
                        _id: courseId
                    }
            }},{
                $pull: {
                    'courseCensor.$.assistant': {
                        _id: userId
                    }
                }
            })
        } catch(err) {
           throw err;
        }
    },
    updateAssistantState: async(courseId, teacherId, assistantId, status)=>{
        const {
            state,
            startJoiningTime,
            endJoiningTime
        } = status;
        try {
            await TeacherCensor.updateOne({'teacher._id': teacherId}, {
                $set: {
                    'courseCensor.$[course].assistant.$[elem].state': state,
                    'courseCensor.$[course].assistant.$[elem].startJoiningTime': startJoiningTime,
                    'courseCensor.$[course].assistant.$[elem].endJoiningTime': endJoiningTime,
                }
            }, {
                arrayFilters: [{
                    'elem._id': assistantId
                }, {
                    'course._id': courseId
                }]
            })

            return {
                ...status,
                _id: assistantId
            }
        } catch(err) {
           throw err;
        }
    },
    requestRating: async(courseInfo, userInfo, message)=> {
        const {
            _id: courseId,
        } = courseInfo;
        const {
            _id: userId,
            image,
            name,
            username
        } = userInfo;
        const {
            rate, content
        } = message;
        try {
            await TeacherCensor.updateOne({
                courseCensor: {
                    $elemMatch: {
                        _id: courseId
                    }
                }
            }, {
                $push: {
                    'courseCensor.$.rating': {
                        student: {
                            _id: userId,
                            image,
                            name,
                            username
                        },
                        content,
                        rate
                    }
                }
            });
        } catch(err) {
           throw err;
        }
    },
    updateRatingState: async(courseId, userId, ratingData)=>{
        const {
            state,
            ratingDate
        } = ratingData;
        try {
            await TeacherCensor.updateOne({}, {
                $set: {
                    'courseCensor.$[course].rating.$[elem].state': state,
                    'courseCensor.$[course].rating.$[elem].ratingDate': ratingDate,
                }
            }, {
                arrayFilters: [{
                    'elem.student._id': userId
                }, {
                    'course._id': courseId
                }],
            });
        } catch(err) {
           throw err;
        }
    },
    cancelRating: async(courseId, userId)=>{
        try {
            await TeacherCensor.updateOne({
                courseCensor: {
                    $elemMatch: {
                        _id: courseId
                    }
            }},{
                $pull: {
                    'courseCensor.$.rating': {
                        'student._id': userId
                    }
                }
            })
        } catch(err) {
           throw err;
        }
    },
    findTeacherCensorById: async(id)=>{
        try {
            const teacher = await TeacherCensor.findOne({'teacher._id': id});

            if(!teacher) throw new Error('teacher does not exists!');
                
            return teacher._doc || teacher; 
        } catch(err) {
           throw err;
        }
    }
}

module.exports = teacherCensorRepository;