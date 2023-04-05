const {queue, event, status} = require('./../constant');
const {progressService} = require('./../service');

class ProgressController {
    constructor(conn) {
        this.conn = conn;
    }
    getCourse = async(req, res)=>{
        try {
            const {_id} = req.user;
            const {courseId} = req.params;

            const {course} = await progressService.getCourse(_id, courseId);
            res.status(status.OK).json(course);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getLesson = async(req, res)=>{
        try {
            const {courseId, lessonId} = req.params;
            const {_id} = req.user;

            const {lesson} = await progressService.getLesson(_id, courseId, lessonId);
            res.status(status.OK).json(lesson);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    
    updatePersonalLesson = async(req, res)=>{
        try {
            const {courseId} = req.params;
            const data = req.body;
            const {lessonId, kind} = req.query;
            const {_id, name} = req.user;

            const payload = {
                courseId,
                lessonId,
                kind,
                userId: _id,
                name,
                data
            }

            await progressService.updatePersonalLesson(payload);

            res.status(status.OK).json('update successfully');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    downloadRankingPdfFile = async(req, res)=>{
        try {
            const {courseId} = req.params;
            const {lessonId} = req.query;
            const payload = {
                courseId,
                lessonId,
            }

            const {submits} = await progressService.downloadRankingPdfFile(payload);

            res.status(status.OK).json(submits);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getAllSubmit = async(req, res)=>{
        try {
            const {courseId} = req.params;
            const {course} = await progressService.getAllSubmit(courseId);
            res.status(status.OK).json(course);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getPersonalSubmit = async(req, res)=>{
        try {
            const {courseId} = req.params;
            const {studentId, lessonId} = req.query;
            const {
                exercise,
                questions,
                personalSubmit
            } = await progressService.getPersonalSubmit(courseId, lessonId, studentId);
            res.status(status.OK).json({
                exercise,
                questions,
                personalSubmit
            })
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    makeScoreForStudent = async(req, res)=> {
        try {
            const {courseId} = req.params;
            const {studentId, lessonId} = req.query;
            // {score: ..., personalAnswers: [{isCorrect: ...}, {...}]}
            const data = req.body;
            
            const payload = {
                courseId,
                userId: studentId,
                lessonId,
                data: {
                    ...data,
                    state: 'READY'
                }
            };
            const submits = await progressService.makeScoreForStudent(payload);
            //if all submits have been scored, we send to notification and course service
            if(submits) {
                //---------------//
                //update for studying file pdf when complete make score
                const channel = await this.conn.createChannel();
                //send to notification
                submits.forEach(async(submit)=>{
                    const {
                        _id
                    } = submit;
                    await channel.assertQueue(queue.NOTIFY_PUBLISH);    
                    await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                        userInfo: {
                            _id
                        },
                        dataInfo: {
                            course: {
                                _id: courseId
                            },
                            lesson: {
                                _id: lessonId
                            }
                        },
                        event: event.notify.rank.SCORED_COMPLETELY
                    })));
                })
            }

            res.status(status.OK).json('make score successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = ProgressController;