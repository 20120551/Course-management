const {cartService} = require('../service')
const {status, queue} = require('../constant');
const {PaymentMachine} = require('./../pattern');

class CartController {
    constructor(conn) {
        this.conn = conn;
    }

    getAllCarts = async(req, res)=>{
        try {
            const {_id} = req.user;
            const {carts} = await cartService.getAllCarts(_id);

            res.status(status.OK).json(carts);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(error.message);
        }
    }

    createOrder = async(req, res)=>{
        try {
            const paymentMachine = new PaymentMachine(this.conn);

            //create new order [DEFAULT]=[PENDING]
            await paymentMachine.doPaymentStep(req.user);

            //create channel waiting for financial service
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.TRANSFER_ENDED);
            channel.consume(queue.TRANSFER_ENDED, async(msg)=>{
                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {status, userInfo, orderInfo} = data;

                //update state of payment machine when receive data from financial service
                await paymentMachine.doPaymentStep({status, userInfo, orderInfo});

                //publish all changed data for all of subscribers
                await paymentMachine.doPaymentStep({userInfo, orderInfo});
                //channel.ack(msg);
            }, {noAck: true});

            res.status(status.OK).json('service is creating order!');
            
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getAllOrders = async(req, res)=>{
        try {
            const {_id} = req.user;
            const {orders} = await cartService.getAllOrders(_id);

            res.status(status.OK).json(orders);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(error.message);
        }
    }

    getParticularOrder = async(req, res)=>{
        try {
            const {orderId} = req.params;
            const {order} = await cartService.getParticularOrder(orderId);

            res.status(status.OK).json(order);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(error.message);
        }
    }
}

module.exports = CartController;