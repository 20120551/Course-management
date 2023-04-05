const {eventServiceProxy } = require('./../pattern');
const {queue} = require('./../constant');
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
                
                const {userInfo, kind, event: userEvent} = data;

                const time = await eventServiceProxy.accountChanged(userInfo, kind, userEvent);
                logger.info('Receive from [ACCOUNT_CHANGED], event: [' + userEvent + '], time: ' + time + 'ms');
            }, {noAck: true});
        } catch(err) {
            console.log('Receive from [ACCOUNT_CHANGED], err: ', err);
        }
    }
    notificationChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.NOTIFY_PUBLISH);
            channel.consume(queue.NOTIFY_PUBLISH, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {dataInfo, userInfo, message, event} = data;

                const {time} = await eventServiceProxy.notificationChanged(dataInfo, userInfo, message, event);
                logger.info('Receive from [NOTIFY_PUBLISH], event: ' + event + ', time: ' + time + 'ms') ;

            }, {noAck: true});
        } catch(err) {
            console.log('Receive from [NOTIFY_PUBLISH], err: ', err);
        }
    }
    
}

module.exports = EventController;
