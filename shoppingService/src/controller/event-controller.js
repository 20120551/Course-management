const {queue} = require('./../constant');
const {proxyEventService} = require('./../pattern');
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
                const {time} = await proxyEventService.accountChanged(userInfo, event);
                logger.info('Receive from [ACCOUNT_CHANGED], event: [' + event + '], time: ' + time + 'ms');
                //channel.ack(msg);
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [ACCOUNT_CHANGED], error: ', err);
        }
    }
    
    cartChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.CART_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.CART_CHANGED, '');

            channel.consume(q.queue, async(msg)=>{
                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userInfo, courseInfo, event} = data;
                const {time} = await proxyEventService.cartChanged(courseInfo, userInfo, event);
                logger.info('Receive from [CART_CHANGED], event: [' + event + '], time: ' + time + 'ms');
                //channel.ack(msg);
            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [CART_CHANGED], error: ', err);
        }
    }
}

module.exports = EventController;