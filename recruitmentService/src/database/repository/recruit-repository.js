const {Recruit} = require('../model');

const recruitRepository = {
    createCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id,
            name,
            background,
            subject,
            grade,
            theme
        } = courseInfo;
        const {
            _id: teacherId,
            name: teacherName,
            image
        } = teacherInfo;
        try {
            const recruit = new Recruit({
                course: {
                    _id,
                    name,
                    background,
                    subject,
                    grade,
                    theme: {
                        _id: theme._id,
                        name: theme.name
                    },
                    teacher: {
                        _id: teacherId,
                        name: teacherName,
                        image
                    }
                }
            });
            await recruit.save();
        } catch(err) {
           throw err;
        }
    },
    updateCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id,
            name,
            background,
            subject,
            grade,
            state,
            deleted
        } = courseInfo;
        try {
            await Recruit.updateOne({'course._id': _id}, {
                $set: {
                    'course.name': name,
                    'course.background': background,
                    'course.subject': subject,
                    'course.grade': grade,
                    'course.state': state,
                    'course.deleted': deleted,
                }
            })
        } catch(err) {
           throw err;
        }
    },
    destroyCourse: async(courseInfo, teacherInfo)=>{
        const {_id} = courseInfo;
        try {
            await Recruit.deleteOne({'course._id': _id});
        } catch(err) {
           throw err;
        }
    },
    assistantUpdated: async(userInfo)=>{
        const {
            _id,
            name,
            image,
        } = userInfo;
        try {
            await Recruit.updateMany({}, {
                $set: {
                    'request.$[elem].name': name,
                    'request.$[elem].image': image,
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
    teacherUpdated: async(userInfo)=>{
        const {
            _id,
            name,
            image
        } = userInfo;
        try {
            await Recruit.updateMany({'course.teacher._id': _id}, {
                $set: {
                    'course.teacher.name': name,
                    'course.teacher.image': image,
                }
            })
        } catch(err) {
           throw err;
        }
    },
    updateRecruitment: async(payload, courseId)=>{
        const {
            title,
            require,
            income,
            startRecruit,
            endRecruit
        } = payload;
        try {
            await Recruit.updateOne({'course._id': courseId}, {
                $set: {
                    title: title,
                    require: require && JSON.parse(require),
                    income: income,
                    startRecruit: new Date(startRecruit),
                    endRecruit: new Date(endRecruit)
                }
            })
        } catch(err) {
           throw err;
        }
    },
    getAllRecruit: async()=>{
        try {
            const recruits = await Recruit.find({});
            if(!recruits) throw new Error('recruit does not exist!');
            return recruits._doc || recruits;
        } catch(err) {
           throw err;
        }
    },
    getPersonalRecruits: async(teacherId)=>{
        try {
            const recruits = await Recruit.find({'course.teacher._id': teacherId});
            if(!recruits) throw new Error('recruit does not exist!');
            return recruits._doc || recruits;
        } catch(err) {
           throw err;
        }
    },
    getRecruit: async(courseId)=>{
        try {
            const recruit = await Recruit.findOne({'course._id': courseId});
            if(!recruit) throw new Error('recruit does not exist!');
            return recruit._doc || recruit;
        } catch(err) {
           throw err;
        }
    },
    requestAssistant: async(assistantInfo, courseId)=>{
        const {
            _id, 
            name,
            image
        } = assistantInfo;
        try {
            const recruit = await Recruit.findOneAndUpdate({'course._id': courseId}, {
                $push: {
                    request: {
                        _id,
                        name,
                        image
                    }
                }
            }, {new: true})
            if(!recruit) throw new Error('recruit does not exist!');

            return recruit._doc || recruit;
        } catch(err) {
           throw err;
        }
    },
    updateAssistant: async(assistantId, courseId, assData)=>{
        const {
            state 
        } = assData;
        try {
            const recruit = await Recruit.findOneAndUpdate({'course._id': courseId}, {
                $set: {
                    'request.$[elem].state': state
                }
            }, {
                arrayFilters: [{
                    'elem._id': assistantId
                }],
                new: true
            })
            if(!recruit) throw new Error('recruit does not exist!');

            return recruit._doc || recruit;
        } catch(err) {
           throw err;
        }
    },
    cancelAssistant: async(assistantId, courseId)=>{
        try {
            const recruit = await Recruit.findOneAndUpdate({'course._id': courseId}, {
                $pull: {
                    request: {
                        _id: assistantId
                    }
                }
            }, {new: true})
            if(!recruit) throw new Error('recruit does not exist!');

            return recruit._doc || recruit;
        } catch(err) {
           throw err;
        }
    },
    endOfRecruit: async(courseId)=>{
        try {
            await Recruit.deleteOne({'course._id': courseId});
        } catch(err) {
           throw err;
        }
    }
}

module.exports = recruitRepository;