const { FormatData } = require('../../utils');
const {orderRepository, cartRepository} = require('./../../database');
const {queue, event} = require('./../../constant');

class SuccessState {
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
            //delete carts 
            const carts = await cartRepository.removeCartsByUserId(userInfo._id);
            const channel = await this.conn.createChannel();
            //update carts in user service
            await channel.assertExchange(queue.CART_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.CART_CHANGED, '', Buffer.from(JSON.stringify({
                userInfo,
                event: event.cart.REMOVE_ALL_CART
            })));

            //update total student in course service, course -> send to progress service
            await channel.assertQueue(queue.ENROLL_COURSE);
            await channel.sendToQueue(queue.ENROLL_COURSE, Buffer.from(JSON.stringify({
                userInfo,
                orderInfo,
                cartInfo: carts
            })));

            //send to notification service
            await channel.assertQueue(queue.NOTIFY_PUBLISH);
            await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                userInfo,
                dataInfo: {
                    order: orderInfo
                },
                event: event.notify.order.PAY_SUCCESS
            })));

            this.paymentMachine.setState(this.paymentMachine.pendingState);
        } catch(err) {
            throw err;
        }
    }
}

module.exports = SuccessState;