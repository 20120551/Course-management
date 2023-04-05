const {status, queue, event} = require('./../constant');
const {recruitService} = require('./../service');

class RecruitController {
    constructor(conn) {
        this.conn = conn;
    }

    getAllRecruits = async(req, res)=>{
        try {
            const {recruits} = await recruitService.getAllRecruits();
            res.status(status.OK).json(recruits);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getRecruit = async(req, res)=>{
        try {
            const {courseId} = req.query;
            const {recruit} = await recruitService.getRecruit(courseId);
            res.status(status.OK).json(recruit);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getPersonalRecruits = async(req, res)=>{
        try {
            const {_id} = req.user;
            const {recruits} = await recruitService.getPersonalRecruits(_id);
            res.status(status.OK).json(recruits);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    updateRecruit = async(req, res)=>{
        try {
            const {courseId} = req.query;
            await recruitService.updateRecruit(req.body, courseId);
            res.status(status.OK).json('update successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    requestAssistant = async(req, res)=>{
        try {
            const {courseId} = req.query;
            const {recruit} = await recruitService.requestAssistant(req.user, courseId);
            const {message} = req.body;
            //send data to teacher
            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.TEACHER_CENSOR);    
            await channel.sendToQueue(queue.TEACHER_CENSOR, Buffer.from(JSON.stringify({
                userInfo: req.user,
                courseInfo: recruit.course,
                message,
                event: event.teacher_censor.REQUEST_ASSISTANT
            })));
            res.status(status.OK).json("let's wait for email respond!");
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    cancelAssistant = async(req, res)=>{
        try {
            const {courseId} = req.query;
            const {recruit} = await recruitService.cancelAssistant(req.user, courseId);
            //send data to teacher
            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.TEACHER_CENSOR);    
            await channel.sendToQueue(queue.TEACHER_CENSOR, Buffer.from(JSON.stringify({
                userInfo: req.user,
                courseInfo: recruit.course,
                event: event.teacher_censor.CANCEL_ASSISTANT
            })));
            res.status(status.OK).json("let's wait for email respond!");
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = RecruitController;