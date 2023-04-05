const {proxyEventService } = require('./../pattern');
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
                const {time} = await proxyEventService.accountChanged(userInfo, event);
                logger.info('Receive from [ACCOUNT_CHANGED], time: ' + time + 'ms');
            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [ACCOUNT_CHANGED], error: ', err);
        }
    }

    transferBudget = async()=>{
        const channel = await this.conn.createChannel();
        try {
            //receive from QUEUE
            await channel.assertQueue(queue.PAYMENT_EXECUTE);

            channel.consume(queue.PAYMENT_EXECUTE, async(msg)=>{
                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userInfo, orderInfo} = data;

                const {financialHistory, time} = await proxyEventService.transferBudget(userInfo, orderInfo.items);
                logger.info('Receive from [PAYMENT_EXECUTE], time: ' + time + 'ms') ;

                //send data back to order
                await channel.assertQueue(queue.TRANSFER_ENDED);
                await channel.sendToQueue(queue.TRANSFER_ENDED, Buffer.from(JSON.stringify({
                    orderInfo,
                    userInfo,
                    status: 'SUCCESS'
                })));
                
                await channel.assertQueue(queue.BUDGET_CHANGED);
                await channel.sendToQueue(queue.BUDGET_CHANGED, Buffer.from(JSON.stringify({
                    finance: financialHistory,
                    status: 'SUCCESS',
                    event: event.budget.TRANSFER_BUDGET
                })));

            }, {noAck: true});
        } catch(err) {
            console.log('error when being transfer!')
            //send data back to order
            await channel.assertQueue(queue.TRANSFER_ENDED);
            await channel.sendToQueue(queue.TRANSFER_ENDED, Buffer.from(JSON.stringify({
                orderInfo,
                userInfo,
                status: 'FAILURE'
            })));
            logger.error('Receive from [PAYMENT_EXECUTE], error: ', err);
        }
    }
}

module.exports = EventController;
