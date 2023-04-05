const {Post} = require('./../model');

const postRepository = {
    findEducatorByPostId: async(postId)=>{
        try {
            const courses = await Post.find({});
            const post = courses.find((course)=>{
                const {posts} = course;
                const {questions = []} = posts;
                if(posts.some((post)=>post._id === postId) || questions.includes(postId))
                    return true;
            })
            if(!post) throw new Error('Post does not exist!');

            return post.educator || [];
        } catch(err) {
            throw err;
        }
    },
    createCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id: courseId,
            state,
            deleted
        } = courseInfo;
        const {
            _id: userId
        } = teacherInfo;
        try {
            const course = new Post({
                course: {
                    _id: courseId,
                    state,
                    deleted
                },
                educator: [userId]
            });
            await course.save();
        } catch(err) {
            throw err;
        }
    },
    updateCourse: async(courseInfo)=>{
        const {
            _id,
            state,
            deleted
        } = courseInfo;
        try {
            await Post.updateOne({'course._id': _id}, {
                $set: {
                    'course.state': state,
                    'course.deleted': deleted
                }
            })
        } catch(err) {
            throw err;
        }
    },
    destroyCourse: async(courseInfo)=>{
        const {_id} = courseInfo;
        try {
            await Post.deleteOne({'course._id': _id});
        } catch(err) {
            throw err;
        }
    },
    findPostById: async(courseId, postId)=>{
        try {
            const course = await Post.findOne({'course._id': courseId});
            if(!course) throw new Error('course does not exist!');

            const {posts} = course;
            const post = posts.find((post)=>post._id === postId);
            return post._doc || post;
        } catch(err) {
            throw err;
        }
    },
    createPost: async(courseId, data)=>{
        const {
            _id,
            kind
        } = data;
        try {
            await Post.updateOne({'course._id': courseId}, {
                $push: {
                    posts: {
                        _id,
                        kind
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    createPosts: async(courseId, data)=>{
        const {
            _id,
            kind,
            questions
        } = data;
        try {
            const questionIds = questions.map(question=>question._id);
            await Post.updateMany({'course._id': courseId}, {
                $push: {
                    posts: {
                        _id,
                        kind,
                        questions: questionIds
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    destroyPost: async(courseId, data)=>{
        const {
            _id
        } = data;
        try {
            await Post.updateOne({'course._id': courseId}, {
                $pull: {
                    posts: {
                        _id: _id
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    addEducatorToCourse: async(courseInfo, assistantInfo)=>{
        const {
            _id: courseId
        } = courseInfo;
        const {
            _id: assistantId
        } = assistantInfo;
        try {
            await Post.updateOne({'course._id': courseId}, {
                $push: {
                    educator: assistantId
                }
            })
        } catch(err) {
            throw err;
        }
    },
    expireAssistantContract: async(courseInfo, assistantInfo)=>{
        const {_id: courseId} = courseInfo;
        const {_id: userId} = assistantInfo;
        try {
            await Post.updateOne({'course._id': courseId}, {
                $push: {
                    educator: {
                        _id: userId
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = postRepository;