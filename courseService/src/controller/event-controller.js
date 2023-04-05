const eventServiceProxy = require('./../pattern/proxy-handleTiming');
const {queue, event} = require('./../constant');
const {logger} = require('./../lib');

class EventController {
    constructor(conn) {
        this.conn = conn;
    }

    accountChanged = async()=> {
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.ACCOUNT_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.ACCOUNT_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userInfo: user, event} = data;

                const {time} = await eventServiceProxy.accountChanged({
                    event,
                    user
                });

                logger.info('Receive from [UPDATE_PROFILE], event: [' + event + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            console.log('Receive from [UPDATE_PROFILE], error: ', err);
        }
    }

    enrollCourses = async()=> {
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.ENROLL_COURSE);
            channel.consume(queue.ENROLL_COURSE, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {cartInfo, userInfo} = data;

                const {courses, time} = await eventServiceProxy.enrollCourses(cartInfo, userInfo);
                logger.info('Receive from [ENROLL_COURSE]');
                logger.info('data: ' + courses);
                logger.info('time: ' + time + 'ms') ;

                //publish for progress service
                await channel.assertQueue(queue.ADD_STUDENT_TO_COURSE);
                await channel.sendToQueue(queue.ADD_STUDENT_TO_COURSE,  Buffer.from(JSON.stringify({
                    userInfo,
                    coursesInfo: courses
                })))
            }, {noAck: true});

        } catch(err) {
            logger.error('Receive from [ENROLL_COURSE], error: ', err);
        }
    }

    assistantChanged = async()=>{
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

                const time = await eventServiceProxy.assistantChanged(assistantInfo, courseInfo, assistantEvent);
                logger.info('Receive from [ASSISTANT_CHANGED], event: [' + assistantEvent + '], time: ' + time + 'ms');
                //channel.ack(msg);
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [ASSISTANT_CHANGED], error: ', err);
        }
    }

    ratingStateChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.RATING_STATE_CHANGED);
            channel.consume(queue.RATING_STATE_CHANGED, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userId, courseId, data: ratingData, event: ratingEvent} = data;

                const {time} = await eventServiceProxy.ratingStateChanged(userId, courseId, ratingData, ratingEvent);
                logger.info('Receive from [RATING_STATE_CHANGED], event: ' + ratingEvent + ', time: ' + time + 'ms') ;
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [RATING_STATE_CHANGED], error: ', err);
        }
    }

    courseStateChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.COURSE_STATE_CHANGED);
            channel.consume(queue.COURSE_STATE_CHANGED, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {courseInfo, event: courseEvent} = data;

                const {time, course} = await eventServiceProxy.courseStateChanged(courseInfo, courseEvent);
                logger.info('Receive from [COURSE_STATE_CHANGED], event: ' + courseEvent + ' time: ' + time + 'ms');

                const {
                    teacher: teacherInfo,
                    ...payload
                } = course;

                //send data to services
                await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });    
                await channel.publish(queue.COURSE_CHANGED,'', Buffer.from(JSON.stringify({
                    courseInfo: payload,
                    teacherInfo,
                    event: courseEvent
                })));
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [COURSE_STATE_CHANGED], error: ', err);
        }
    }

    progressChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.PROGRESS_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.PROGRESS_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {coursesInfo, userInfo, event} = data;

                const time = await eventServiceProxy.progressChanged(coursesInfo, userInfo, event);
                logger.info('Receive from [PROGRESS_CHANGED], event: [' + event + '], time: ' + time + 'ms');

            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [PROGRESS_CHANGED], error: ', err);
        }
    }
}

module.exports = EventController;