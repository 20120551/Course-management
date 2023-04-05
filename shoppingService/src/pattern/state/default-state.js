const { FormatData } = require('../../utils');
const {orderRepository, cartRepository} = require('./../../database');
const {queue, event} = require('./../../constant');

class DefaultState {
    constructor(paymentMachine, conn){
        this.paymentMachine = paymentMachine;
        this.conn = conn;
    }

    payment = async(payload)=> {
        const userInfo = payload;
        try{
            //create new order with default paymentMachine
            const carts = await cartRepository.getAllCarts(userInfo._id);

            const order = await orderRepository.createOrder(userInfo, carts.items);
            //send data to payment service
            
            const channel = await this.conn.createChannel();

            //send data to QUEUE
            await channel.assertQueue(queue.PAYMENT_EXECUTE);
            
            //financial
            await channel.sendToQueue(queue.PAYMENT_EXECUTE, Buffer.from(JSON.stringify({
                userInfo,
                orderInfo: order,
            })));

            //send data to USER service
            await channel.assertQueue(queue.ORDER_CHANGED);

            await channel.sendToQueue(queue.ORDER_CHANGED, Buffer.from(JSON.stringify({
                userInfo,
                orderInfo: order,
                event: event.order.ADD_TO_ORDER
            })));

            this.paymentMachine.setState(this.paymentMachine.pendingState);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = DefaultState;