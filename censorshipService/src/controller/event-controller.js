const {queue, event} = require('./../constant');
const {logger} = require('./../lib');
const {eventServiceProxy} = require('./../pattern');

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

                const {userInfo: user, event, kind} = data;

                const {time} = await eventServiceProxy.accountChanged({
                    event,
                    user,
                    kind
                });

                logger.info('Receive from [UPDATE_PROFILE], event: [' + event + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            logger.error('Receive from [TEACHER_CENSOR], error: ', err);
        }
    }
    
    requestCensorship = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.TEACHER_CENSOR);
            channel.consume(queue.TEACHER_CENSOR, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userInfo, courseInfo, message, event} = data;

                const {time} = await eventServiceProxy.requestCensorship(courseInfo, userInfo, message, event);
                logger.info('Receive from [TEACHER_CENSOR]', 'event: ' + event + ', time: ' + time + 'ms') ;

            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [TEACHER_CENSOR], error: ', err);
        }
    }

    requestCourse = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.COURSE_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {teacherInfo, courseInfo, event} = data;

                const {time} = await eventServiceProxy.requestCourse(courseInfo, teacherInfo, event);
                logger.info('Receive from [COURSE_CHANGED], event: ' + event + 'time: ' + time + 'ms') ;
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [COURSE_CHANGED], error: ', err);
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
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [ASSISTANT_CHANGED], error: ', err);
        }
    }
}


module.exports = EventController;