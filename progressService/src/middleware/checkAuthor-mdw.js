const {teachingRepository, studyingRepository} = require('./../database');
const {status} = require('./../constant');

const checkAuthorMDW = {
    studentAuthor: async(req, res, next)=>{
        try {
            const {_id: userId} = req.user;
            const {courseId} = req.params;

            const user = await studyingRepository.findUserById(userId);

            if(!user) return res.status(403).json('user does not exists!');
            const {courses} = user;
            if(!courses.some(c=>c._id === courseId)) return res.status(403).json('you are not permission!');
            next();
        } catch(err) {
            res.status(status.UN_AUTHORIZED).json(err.message);
        }
    },
    teacherAuthor: async(req, res, next)=>{
        try {
            const {_id: userId} = req.user;
            const {courseId} = req.params;

            const course = await teachingRepository.findCourseById(courseId);
            const {educator} = course;

            if(!educator.some(e=>e._id === userId)) return res.status(403).json('you are not permission!');

            next();
        } catch(err) {
            res.status(status.UN_AUTHORIZED).json(err.message);
        }
    }
}

module.exports = checkAuthorMDW;