const {queue, event} = require('./../constant');
const {logger} = require('./../lib');
const {eventServiceProxy} = require('./../pattern');
const {progressService } =require('./../service');

class EventController {
    constructor(conn) {
        this.conn = conn;
    }

    accountChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.ACCOUNT_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.ACCOUNT_CHANGED, '');

            channel.consume(q.queue, async(msg)=>{
                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userInfo, kind, event: userEvent} = data;

                const {time} = await eventServiceProxy.accountChanged(userInfo, kind, userEvent);
                logger.info('Receive from [ACCOUNT_CHANGED], event: [' + userEvent + '], time: ' + time + 'ms');
            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [ACCOUNT_CHANGED], error: ', err);
        }
    }
    addStudentToCourse = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.ADD_STUDENT_TO_COURSE);
            channel.consume(queue.ADD_STUDENT_TO_COURSE, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {coursesInfo, userInfo} = data;

                const {courses, time} = await eventServiceProxy.addStudentToCourse(userInfo, coursesInfo);
                logger.info('Receive from [ADD_STUDENT_TO_COURSE], time: ' + time + 'ms') ;

                //publish for user service
                await channel.assertExchange(queue.PROGRESS_CHANGED, 'fanout', { durable: false });
                await channel.publish(queue.PROGRESS_CHANGED, '', Buffer.from(JSON.stringify({
                    coursesInfo: courses,
                    userInfo,
                    event: event.progress.ADD_COURSE_TO_PROGRESS
                })))

                //setimeout to publish expires course here
                //send to: [COURSE, USER], delete on course and progress, update isExpire in user
                coursesInfo.forEach((course)=>{
                    const {
                        _id: courseId,
                        expires
                    } = course;
                    const {
                        _id: userId
                    } = userInfo;

                    const timeRolling = {
                        startRolling: new Date(),
                        endCourse: new Date(new Date().setFullYear(new Date().getFullYear() + expires/365)),
                    }

                    setTimeout(async() => {
                        await progressService.deleteCourseFromProgress(userId, courseId);
                        await channel.assertExchange(queue.PROGRESS_CHANGED, 'fanout', { durable: false });
                        await channel.publish(queue.PROGRESS_CHANGED, '', Buffer.from(JSON.stringify({
                            coursesInfo: course,
                            userInfo,
                            event: event.progress.EXPIRE_COURSE_IN_PROGRESS
                        })))

                        //send to notification
                        await channel.assertQueue(queue.NOTIFY_PUBLISH);    
                        await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                            userInfo,
                            dataInfo: {
                                course: course,
                            },
                            event: event.notify.expire.EXPIRE_STUDENT
                        })));
                        //new Date(timeRolling.endCourse).getTime() - new Date(timeRolling.startRolling).getTime()
                    }, 86400000);
                })
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [ADD_STUDENT_TO_COURSE], error: ', err);
        }
    }
    
    courseChanged = async()=> {
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.COURSE_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());
                
                const {courseInfo, teacherInfo, event: courseEvent} = data;

                const {time} = await eventServiceProxy.courseChanged(courseInfo, teacherInfo, courseEvent);
                logger.info('Receive from [COURSE_CHANGED], event: [' + courseEvent + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            console.log('Receive from [COURSE_CHANGED], err: ', err);
        }
    }

    assistantChanged = async()=> {
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.ASSISTANT_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.ASSISTANT_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());
                
                const {assistantInfo, courseInfo, event: assistantEvent} = data;

                const {time} = await eventServiceProxy.assistantChanged(assistantInfo, courseInfo, assistantEvent);
                logger.info('Receive from [ASSISTANT_CHANGED], event: [' + assistantEvent + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            console.log('Receive from [ASSISTANT_CHANGED], err: ', err);
        }
    }

    lessonChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.LESSON_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.LESSON_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());
                
                const {courseId, lessonInfo, event: lessonEvent, index} = data;

                const {time} = await eventServiceProxy.lessonChanged(courseId, lessonInfo, lessonEvent, index);
                logger.info('Receive from LESSON_CHANGED], event: [' + lessonEvent + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            console.log('Receive from LESSON_CHANGED], err: ', err);
        }
    }
    chapterChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            await channel.assertExchange(queue.CHAPTER_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.CHAPTER_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {chapterInfo, lessonsInfo = [], index, courseId, event: chapterEvent} = data;

                const {time} = await eventServiceProxy.chapterChanged(courseId, chapterInfo, chapterEvent, index);
            
                logger.info('Receive from [CHAPTER_CHANGED], event: ' + chapterEvent);
                logger.info('time: ' + time + 'ms');

                if(chapterEvent === event.chapter.DESTROY_CHAPTER) return;
                
                lessonsInfo.forEach(async(lesson)=>{
                    const {
                        kind,
                    } = lesson;

                    const lessonEvent = event[kind][`${chapterEvent.split('_')[0]}_${kind.toUpperCase()}`];

                    const {time: t} = await eventServiceProxy.lessonChanged(
                        courseId, 
                        lesson, 
                        lessonEvent,
                        index
                    );
                    logger.info('Receive from [LESSON_CHANGED], event: ' + lessonEvent);
                    logger.info('time: ' + t + 'ms') ;
                });
                
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [CHAPTER_CHANGED], error: ', err);
        }
    }
    // get data from create course and 
}

module.exports = EventController;