const { FormatData } = require('../../utils');
const {orderRepository, cartRepository} = require('./../../database');
const {queue, event} = require('./../../constant');

class FailureState {
    constructor(paymentMachine, conn){
        this.paymentMachine = paymentMachine;
        this.conn = conn;
    }

    payment = async(payload)=>{
        const {
            userInfo,
            orderInfo
        } = payload;
        try {
            const channel = await this.conn.createChannel();

            //send to notification service
            await channel.assertQueue(queue.NOTIFY_PUBLISH);
            await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                userInfo,
                dataInfo: {
                    order: orderInfo
                },
                event: event.notify.order.PAY_FAILURE
            })));

            //auto delete after 7 days
            setTimeout(async() => {
                await orderRepository.removeOrder(orderInfo._id);
                //update status of order in user service
                await channel.assertQueue(queue.ORDER_CHANGED);
                await channel.sendToQueue(queue.ORDER_CHANGED, Buffer.from(JSON.stringify({
                    userInfo,
                    event: event.order.REMOVE_FROM_ORDER
                })));
            }, 604800000);

            this.paymentMachine.setState(this.paymentMachine.pendingState);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = FailureState;