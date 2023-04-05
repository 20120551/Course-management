const {AdminCensor, CourseCensor} = require('./../model');

const adminCensorRepository = {
    createCensor: async(user)=>{
        const {
            _id,
            name,
            username,
            image,
        } = user;
        try {
            const censor = new AdminCensor({
                _id,
                name,
                username,
                image
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
            await AdminCensor.updateOne({_id: _id}, {
                $set: {
                    name: name,
                    username:username,
                    image: image
                }
            })
        } catch(err) {
            throw err;
        }
    },
    updateNewInAdminCensor: async(state)=>{
        try {
            await CourseCensor.updateMany({state: state}, {
                $set: {
                    new: false
                }
            })
        } catch(err) {
            throw err;
        }
    },
    getAllCoursesRequest: async(state)=>{
        try {
            const courses = await CourseCensor.find({state: state});
            if(!courses) throw new Error('no course exists with this state!');
                
            return courses._doc || courses;
        } catch(err) {
            throw err;
        }
    },
    getAcceptableCourse: async(adminId)=>{
        try {
            const censor = await AdminCensor.find({_id: adminId}).populate('acceptableCourse');

            if(!censor) throw new Error('admin id does not exists!');
            
            const {acceptableCourse} = censor._doc;
            return acceptableCourse;
        } catch(err) {
            throw err;
        }
    },
    createCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id,
            name,
            subject,
            background,
            price,
            expires,
            state
        } = courseInfo;
        const {
            _id: teacherId,
            name: teacherName
        } = teacherInfo;
        try {
            const course = new CourseCensor({
                _id,
                name,
                subject,
                background,
                price,
                expires,
                state,
                teacher: {
                    _id: teacherId,
                    name: teacherName
                }
            })

            await course.save();
        } catch(err) {
            throw err;
        }
    },
    updateCourse: async(courseInfo)=>{
        const {
            _id,
            name,
            subject,
            background,
            price,
            expires,
            deleted,
            state
        } = courseInfo;
        try {
            const course = await CourseCensor.findOneAndUpdate({_id: _id}, {
                $set: {
                    name: name,
                    subject: subject,
                    background: background,
                    price: price,
                    expires: expires,
                    deleted: deleted,
                    state: state
                }
            }, {new: true})

            if(!course) throw new Error('course doest not exist!')

            return course._doc || course;
        } catch(err) {
            throw err;
        }
    },
    destroyCourse: async(courseInfo)=>{
        const {
            _id,
        } = courseInfo;
        try {
            await CourseCensor.deleteOne({_id: _id});
        } catch(err) {
            throw err;
        }
    },
    addCourseToAdminCensor: async(courseId, userId)=>{
        try {
            await AdminCensor.updateOne({_id: userId}, {
                $push: {
                    acceptableCourse: courseId
                }
            })
        } catch(err) {
            throw err;
        }
    },
    removeCourseToAdminCensor: async(courseId)=>{
        try {
            await AdminCensor.updateOne({},{
                $pull: {
                    acceptableCourse: {courseId}
                }
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = adminCensorRepository;