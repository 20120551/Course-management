const {cartRepository, orderRepository} = require('./../database');
const {FormatData} = require('./../utils');

const cartService = {
    getAllCarts: async(id)=>{
        try {   
            const carts = await cartRepository.getAllCarts(id);
            return FormatData({carts});
        } catch(err) {
            throw err;
        }
    },
    getAllOrders: async(id)=>{
        try {   
            const orders = await orderRepository.getAllOrders(id);
            return FormatData({orders});
        } catch(err) {
            throw err;
        }
    },
    getParticularOrder: async(orderId)=>{
        try {   
            const order = await orderRepository.getParticularOrder(orderId);
            return FormatData({order});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = cartService;