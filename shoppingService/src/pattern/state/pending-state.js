const { FormatData } = require('../../utils');
const {orderRepository, cartRepository} = require('./../../database');
const {queue, event} = require('./../../constant');

class PendingState {
    constructor(paymentMachine, conn){
        this.paymentMachine = paymentMachine;
        this.conn = conn;
    }
    
    payment = async(payload)=> {
        const {
            userInfo,
            orderInfo,
            status
        } = payload;
        try{
            //change status of order
            const order = await orderRepository.updateStatus(orderInfo._id, status);
            //send data to payment service

            const channel = await this.conn.createChannel();

            //update status of order in user service
            await channel.assertQueue(queue.ORDER_CHANGED);
            await channel.sendToQueue(queue.ORDER_CHANGED, Buffer.from(JSON.stringify({
                userInfo,
                orderInfo: order,
                event: event.order.UPDATE_IN_ORDER
            })));

            this.paymentMachine.setState(this.paymentMachine[`${status.toLowerCase()}State`]);
            return FormatData({order});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = PendingState;