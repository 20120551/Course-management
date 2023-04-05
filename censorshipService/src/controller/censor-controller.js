const {censorService} = require('../service')
const {status, queue, event} = require('../constant');

class CensorController {
    constructor(conn) {
        this.conn = conn;
    }

    getAllAssistantRequest = async(req, res)=>{
        try {
            const {courseId} = req.params;
            const {_id: teacherId} = req.user;
            const {course} = await censorService.getAllAssistantRequest(courseId, teacherId);
            res.status(status.OK).json(course.assistant);
        } catch(err){
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    updateAssistantState = async(req, res)=>{
        try {
            const {_id: teacherId} = req.user;
            const {state, message} = req.body;
            const {assistantId, courseId} = req.params;

            const {assistantInfo} = await censorService.updateAssistantState(courseId, teacherId, assistantId, state);
            //send data to course service
            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.ASSISTANT_STATE_CHANGED);    
            await channel.sendToQueue(queue.ASSISTANT_STATE_CHANGED, Buffer.from(JSON.stringify({
                userId: assistantId,
                courseId: courseId,     
                data: assistantInfo,
                event: event.assistant_state[`${state}_STATE`]
            })));
            //send notification to assistant
            await channel.assertQueue(queue.NOTIFY_PUBLISH)
            await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                dataInfo: {
                    course: {
                        _id: courseId
                    }
                },  
                userInfo: {
                    ...assistantInfo._doc,
                    _id: assistantId
                },
                message,
                event: event.notify.censor[`ASSISTANT_${state}`]
            })));

            res.status(status.OK).json('update assistant state successfully!');
        } catch(err){
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    cancelAssistantRequest = async(req, res)=>{
        try {
            const {message} = req.body;
            const {_id: teacherId} = req.user;
            const {assistantId, courseId} = req.params;
            await censorService.cancelAssistantRequest(courseId, teacherId, assistantId);
            
            //send data to course service
            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.ASSISTANT_STATE_CHANGED);    
            await channel.sendToQueue(queue.ASSISTANT_STATE_CHANGED, Buffer.from(JSON.stringify({
                userId: assistantId,
                courseId: courseId,
                event: event.assistant_state.REJECT_STATE
            })));

            //send notification to assistant
            await channel.assertQueue(queue.NOTIFY_PUBLISH)
            await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                dataInfo: {
                    course: {
                        _id: courseId
                    }
                },  
                userInfo: {
                    _id: assistantId
                },
                message,
                event: event.notify.censor.ASSISTANT_REJECT
            })));
            res.status(status.OK).json('cancel assistant updated!');
        } catch(err){
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getAllRatingRequest = async(req, res)=>{
        try {
            const {courseId} = req.params;
            const {_id: teacherId} = req.user;
            const {course} = await censorService.getAllRatingRequest(courseId, teacherId);
            res.status(status.OK).json(course.rating);
        } catch(err){
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    updateRatingState = async(req, res)=>{
        try {
            const {state} = req.body;
            const {studentId, courseId} = req.params;

            const ratingData = {
                state,
                ratingDate: new Date()
            }
            await censorService.updateRatingState(courseId, studentId, ratingData);

            //send data to course service
            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.RATING_STATE_CHANGED);    
            await channel.sendToQueue(queue.RATING_STATE_CHANGED, Buffer.from(JSON.stringify({
                userId: studentId,
                courseId: courseId,
                data: ratingData,
                event: event.rating_state.APPROVE_STATE
            })));

            res.status(status.OK).json('update rating state successfully!');
        } catch(err){
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    cancelRatingRequest = async(req, res)=>{
        try {
            const {studentId, courseId} = req.query;

            await censorService.cancelRatingRequest(courseId, studentId);
            
            //send data to course service
            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.RATING_STATE_CHANGED);    
            await channel.sendToQueue(queue.RATING_STATE_CHANGED, Buffer.from(JSON.stringify({
                userId: studentId,
                courseId: courseId,
                event: event.rating_state.REJECT_STATE
            })));
            res.status(status.OK).json('cancel rating updated!');
        } catch(err){
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getAllCoursesRequest = async(req, res)=>{
        try {
            const {state} = req.query;
            const {courses} = await censorService.getAllCoursesRequest(state);
            res.status(status.OK).json(courses);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getPersonalCourse = async(req, res)=>{
        try {
            const {_id} = req.user;
            const {courses} = await censorService.getPersonalCourse(_id);
            res.status(status.OK).json(courses);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    acceptCourseRequest = async(req, res)=>{
        try {
            const {_id: adminId} = req.user;
            const {courseId} = req.params;
            const {state, message} = req.body;

            const course = {
                _id: courseId,
                state,
            }

            const {course: courseInfo} = await censorService.updateCourseState(adminId, course);
            //get teacher info and send back to notification service

            const channel = await this.conn.createChannel();

            //send data to QUEUE
            await channel.assertQueue(queue.COURSE_STATE_CHANGED);
            await channel.sendToQueue(queue.COURSE_STATE_CHANGED, Buffer.from(JSON.stringify({
                courseInfo: course,
                event: event.course[`${state}_COURSE`]
            })));

            const {
                teacher,
                ...payload
            } = courseInfo._doc || courseInfo;
            //send notification to assistant
            await channel.assertQueue(queue.NOTIFY_PUBLISH)
            await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                dataInfo: {
                    course: payload
                },
                userInfo: teacher,
                message,
                event: event.notify.censor.COURSE_APPROVE
            })));
            res.status(status.OK).json('accept rating updated!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    cancelCourseRequest = async(req, res)=>{
        try {
            const {courseId} = req.params;
            const {state, message} = req.body;

            const course = {
                _id: courseId,
                state,
            }

            const {course: courseInfo} = await censorService.cancelCourseRequest(course);
            //get teacher info and send back to notification service

            const channel = await this.conn.createChannel();
            //send data to QUEUE
            await channel.assertQueue(queue.COURSE_STATE_CHANGED);
            await channel.sendToQueue(queue.COURSE_STATE_CHANGED, Buffer.from(JSON.stringify({
                courseInfo: course,
                event: event.course[`${state}_COURSE`]
            })));

            const {
                teacher,
                ...payload
            } = courseInfo._doc || courseInfo;
            //send notification to assistant
            await channel.assertQueue(queue.NOTIFY_PUBLISH)
            await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                dataInfo: {
                    course: payload
                },
                userInfo: teacher,
                message,
                event: event.notify.censor.COURSE_REJECT
            })));

            res.status(status.OK).json('cancel rating updated!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = CensorController;