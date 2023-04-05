const { FormatData } = require('../utils');
const {postRepository, commentRepository, discussionRepository} = require('./../database');
const {event} = require('./../constant')

const eventService = {
    accountChanged: async(userInfo, userEvent)=>{
        try {
            switch(userEvent) {
                case event.user.CREATE_ACCOUNT: 
                    break;
                default:
                    await commentRepository.updateProfile(userInfo);
                    await discussionRepository.updateProfile(userInfo);
                    break;
            }
        } catch(err){
            throw err;
        }
    },
    courseChanged: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            switch(courseEvent) {
                case event.course.CREATE_COURSE:
                    await postRepository.createCourse(courseInfo, teacherInfo);
                    break;
                case event.course.DESTROY_COURSE:
                    await postRepository.destroyCourse(courseInfo);
                    break;
                default:
                    await postRepository.updateCourse(courseInfo);
                    break;
            }
        } catch(err){
            throw err;
        }
    },
    lessonChanged: async(courseId, lessonInfo, lessonEvent)=>{
        try {
            switch(lessonEvent) {
                case event.exercise.CREATE_EXERCISE:
                    await postRepository.createPosts(courseId, lessonInfo);
                    await discussionRepository.createPosts(lessonInfo);
                    break;
                case event.lecture.CREATE_LECTURE:
                    await postRepository.createPost(courseId, lessonInfo);
                    await discussionRepository.createPost(lessonInfo);
                    break;
                case event.exercise.DESTROY_EXERCISE:
                    const post = await postRepository.findPostById(courseId, lessonInfo._id);
                    await postRepository.destroyPost(courseId, lessonInfo);
                    await discussionRepository.destroyPosts(post);
                    break;
                case event.lecture.DESTROY_LECTURE:
                    await postRepository.destroyPost(courseId, lessonInfo);
                    await discussionRepository.destroyPost(lessonInfo);
                    break;
                default:
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    assistantChanged: async(assistantInfo, courseInfo, assistantEvent)=>{
        try {
            switch(assistantEvent){
                case event.assistant.ADD_ASSISTANT_TO_SERVICE:
                    await postRepository.addEducatorToCourse(courseInfo, assistantInfo);
                    break;
                case event.assistant.EXPIRE_ASSISTANT_CONTRACT:
                    await postRepository.expireAssistantContract(courseInfo, assistantInfo);
                    break;
            }
        } catch(err){
            throw err;
        }
    },
}

module.exports = eventService;