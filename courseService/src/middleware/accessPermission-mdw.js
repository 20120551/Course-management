const { status } = require('../constant');
const { courseRepository } = require('./../database');

const accessPermissionMDW = {
    courseAccessed: async(req, res, next)=>{
        try {
            //get ID of educator
            const {_id} = req.user;
            const {id} = req.params;

            //check userId and courseId relation
            const course = await courseRepository.findCourseById(id);

            if(course.teacher._id !== _id) 
                return res.status(status.UN_AUTHORIZED).json('you are not permission!');
            
            next();
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = accessPermissionMDW;