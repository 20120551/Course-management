const {eventServiceProxy } = require('./../pattern');
const {status, event, queue} = require('./../constant');
const {logger} = require('./../lib');

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

                const {userInfo, event} = data;
                const {time} = await eventServiceProxy.accountChanged(userInfo, event);
                logger.info('Receive from [ACCOUNT_CHANGED], event: [' + event + '], time: ' + time + 'ms');
                //channel.ack(msg);
            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [ACCOUNT_CHANGED], error: ', err);
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
                
                const {courseId, lessonInfo, event: lessonEvent} = data;

                const time = await eventServiceProxy.lessonChanged(courseId, lessonInfo, lessonEvent);
                logger.info('Receive from .LESSON_CHANGED], event: [' + lessonEvent + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            console.log('Receive from .LESSON_CHANGED], err: ', err);
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
                logger.info('Receive from [CHAPTER_CHANGED], event: ' + chapterEvent);
                //handle lesson
                lessonsInfo.forEach(async(lesson)=>{
                    const {
                        kind,
                        ...data
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

                const time = await eventServiceProxy.assistantChanged(assistantInfo, courseInfo, assistantEvent);
                logger.info('Receive from [ASSISTANT_CHANGED], event: [' + assistantEvent + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            console.log('Receive from [ASSISTANT_CHANGED], err: ', err);
        }
    }
}

module.exports = EventController;
