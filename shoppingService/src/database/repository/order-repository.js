const { Order } = require('./../model');

const orderRepository = {
    createOrder: async(customerInfo, carts)=>{
        try {
            const order = new Order({
                customer: {
                    _id: customerInfo._id,
                },
                items: [...carts]
            })

            const result = await order.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    updateStatus: async(orderId, status)=>{
        try {
            const order = await Order.findByIdAndUpdate({_id: orderId}, {
                status: status
            }, {new: true});

            if(!order) throw new Error('order does not exist!');

            return order._doc || order;
        } catch(err) {
            throw err;
        }
    },
    removeOrder: async(orderId)=>{
        try {
            await Order.deleteOne({_id: orderId});
        } catch(err) {
            throw err;
        }
    },
    getAllOrders: async(userId)=>{
        try {
            const orders = await Order.find({'customer._id': userId});
            if(!orders) throw new Error('order does not exist!');

            return orders._doc || orders;
        } catch(err) {
            throw err;
        }
    },
    getParticularOrder: async(orderId)=>{
        try {
            const order = await Order.findOne({_id: orderId});
            if(!order)  throw new Error('order does not exist!');
            
            return order._doc || order;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = orderRepository;