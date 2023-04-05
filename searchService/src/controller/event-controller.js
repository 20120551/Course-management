const {eventServiceProxy } = require('./../pattern');
const {status, event, queue} = require('./../constant');
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

                logger.info('Receive from [ACCOUNT_CHANGED], event: [' + event + '], time: ' + time + 'ms');
                channel.ack(msg);
            });

        } catch(err) {
            console.log('Receive from [ACCOUNT_CHANGED], error: ', err);
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

                const time = await eventServiceProxy.courseChanged(courseInfo, teacherInfo, courseEvent);
                logger.info('Receive from [COURSE_CHANGED], event: [' + courseEvent + '], time: ' + time + 'ms');
                channel.ack(msg);
            });

        } catch(err) {
            console.log('Receive from [COURSE_CHANGED], err: ', err);
        }
    }
}

module.exports = EventController;
