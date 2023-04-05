const {Lecture} = require('./../model');

const lectureRepository = {
    createLesson: async(payload)=>{
        const {
            code,
            description,
            isBlock = true,
            totalTime
        } = payload;
        try {
            const lecture = new Lecture({
                background: `https://i.ytimg.com/vi_webp/${code}/sddefault.webp`,
                code,
                description,
                isBlock,
                totalTime
            })
    
            const result = await lecture.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    updateLesson: async(payload)=>{
        const {
            _id,
            code,
            description,
            isBlock,
            totalTime
        } = payload;
        try {
            const result = await Lecture.findOneAndUpdate({_id: _id}, {
                background: `https://i.ytimg.com/vi_webp/${code}/sddefault.webp`,
                code,
                description,
                isBlock,
                totalTime
            })
            if(!result) throw new Error('lecture does not exist');
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    deleteLesson: async(payload)=>{
        const {
            lessonId
        } = payload;
        try {   
            await Lecture.delete({_id: lessonId});
        } catch(err) {
            throw err;
        }
    },
    destroyLesson: async(payload)=>{
        const {
            lessonId
        } = payload;
        try {
            await Lecture.deleteOne({_id: lessonId});
        } catch(err) {
            throw err;
        }
    },
    restoreLesson: async(payload)=>{
        const {
            lessonId
        } = payload;
        try {
            await Lecture.restore({_id: lessonId});
        } catch(err) {
            throw err;
        }
    },
    findLessonById: async(_id)=>{
        try {
            const lecture = await Lecture.findById({_id: _id});
            if(!lecture) throw new Error('lecture does not exist');

            return lecture._doc || lecture;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = lectureRepository;