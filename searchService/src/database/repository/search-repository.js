const {Search} = require('./../model');

const searchRepository = {
    createCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id,
            name: courseName,
            background,
            subject,
            theme,
        } = courseInfo;

        try {
            const search = new Search({
                _id,
                name: courseName,
                background,
                subject,
                theme: {
                    _id: theme._id,
                    name: theme.name
                },
                teacher: teacherInfo,
            })

            await search.save();
        } catch(err){
            console.log(err);
        }
    },
    updateCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id,
            name: courseName,
            background,
            subject,
            theme,
        } = courseInfo;

        try {
            await Search.updateOne({_id: _id}, {
                $set: {
                    name: courseName,
                    background: background,
                    subject: subject,
                    theme: {
                        _id: theme._id,
                        name: theme.name
                    }
                }
            })
        } catch(err){
            console.log(err);
        }
    },
    destroyCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id
        } = courseInfo;

        try {
            await Search.deleteOne({_id: _id})
        } catch(err){
            console.log(err);
        }
    },
    updateTeacherProfile: async(user)=>{
        const {
            _id,
            name,
            image,
        } = user;
        try {
            await Search.updateMany({'teacher._id': _id},{
                'teacher.name': name,
                'teacher.image': image,
            });

        } catch(err){
            console.log(err);
        }
    },
    searchData: async(query)=>{
        try {
            const queryString = query.replace('+', ' ');
            const courses = await Search.find();
            return courses;
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = searchRepository;