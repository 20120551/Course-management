const {eventServiceProxy } = require('./../pattern');
const {status, event, queue} = require('./../constant');
const {logger} = require('./../lib');
const {recruitService }= require('./../service');

class EventController {
    constructor(conn) {
        this.conn = conn;
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

                const time = await eventServiceProxy.courseChanged(courseInfo, teacherInfo, courseEvent);
                logger.info('Receive from [COURSE_CHANGED], event: [' + courseEvent + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            logger.error('Receive from [COURSE_CHANGED], err: ', err);
        }
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

                const {userInfo, event} = data;

                const {time} = await eventServiceProxy.accountChanged(userInfo, event);

                logger.info('Receive from [ACCOUNT_CHANGED], event: [' + event + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            logger.error('Receive from [ACCOUNT_CHANGED], error: ', err);
        }
    }

    assistantStateChanged = async()=> {
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.ASSISTANT_STATE_CHANGED);
            channel.consume(queue.ASSISTANT_STATE_CHANGED, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userId, courseId, data: assData, event: assistantEvent} = data;
                
                const {course, time} = await eventServiceProxy.assistantStateChanged(userId, courseId, assData, assistantEvent);
                logger.info('Receive from [ASSISTANT_STATE_CHANGED], event: ' + assistantEvent);
                logger.info('time: ' + time + 'ms') ;

                if(assistantEvent !== 'APPROVE_STATE') return;
                const {
                    startJoiningTime,
                    endJoiningTime
                } = assData;
                
                //publish for user service and progress service

                //publish for user service and progress service
                await channel.assertExchange(queue.ASSISTANT_CHANGED, 'fanout', { durable: false });    
                await channel.publish(queue.ASSISTANT_CHANGED,'', Buffer.from(JSON.stringify({
                    assistantInfo: {
                        _id: userId,
                        ...assData
                    },
                    courseInfo: course,
                    event: event.assistant.ADD_ASSISTANT_TO_SERVICE
                })));
                //setimeout to publish out of contract here
                //send to: [USER, PROGRESS, CENSOR], delete on user, progress, censor
                setTimeout(async()=>{
                    //delete assistant in here
                    await recruitService.cancelAssistant(userId, courseId);
                    await channel.assertExchange(queue.ASSISTANT_CHANGED, 'fanout', { durable: false });    
                    await channel.publish(queue.ASSISTANT_CHANGED,'', Buffer.from(JSON.stringify({
                        assistantInfo: {
                            _id: userId,
                            ...assData
                        },
                        courseInfo: course,
                        event: event.assistant.EXPIRE_ASSISTANT_CONTRACT
                    })));

                    //send to notification
                    await channel.assertQueue(queue.NOTIFY_PUBLISH);    
                    await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                        userInfo: {
                            _id: userId,
                            ...assData
                        },
                        dataInfo: {
                            course: course
                        },
                        event: event.notify.expire.EXPIRE_ASSISTANT
                    })));
                }, 86400000);
                //new Date(endJoiningTime).getTime() - new Date(startJoiningTime).getTime()
                //channel.ack(msg);
            },{noAck: true});

        } catch(err) {
            logger.error('Receive from [ASSISTANT_STATE_CHANGED], error: ', err);
        }
    }
}

module.exports = EventController;
