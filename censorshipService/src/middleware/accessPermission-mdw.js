const { status } = require('../constant');
const { teacherCensorRepository } = require('./../database');

const accessPermissionMDW = {
    courseAccessed: async(req, res, next)=>{
        try {
            //get ID of educator
            const {_id} = req.user;
            const {courseId} = req.params;

            //check userId and courseId relation
            const teacher = await teacherCensorRepository.findTeacherCensorById(_id);
            const {courseCensor} = teacher;

            if(!courseCensor.some((course)=>course._id === courseId)) 
                return res.status(status.UN_AUTHORIZED).json('you are not permission!');
            
            next();
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = accessPermissionMDW;