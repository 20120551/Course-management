const {Cart} = require('./../model');
const {logger} = require('./../../lib');

const cartRepository = {
    createAccount: async(userInfo)=>{
        const {
            _id,
            name
        } = userInfo;
        try {
            const cart = new Cart({
                customer: {
                    _id,
                    name
                }
            });

            await cart.save();
        } catch(err) {
            throw err;
        }
    },
    updateAccount: async(userInfo)=>{
        const {
            _id,
            name
        } = userInfo;
        try {
            await Cart.updateOne({'customer._id': _id}, {
                $set: {
                    'customer.name': name
                }
            });
        } catch(err) {
            throw err;
        }
    },
    createCart: async(courseInfo, userInfo)=>{
        const {
            _id: courseId,
            name,
            price,
            grade,
            subject,
            theme,
            expires,
            teacher
        } = courseInfo;
        const {_id} = userInfo;
        try {
            const data = {
                _id: courseId,
                name,
                price,
                grade,
                subject,
                expires,
                theme: {
                    _id: theme._id,
                    name: theme.name
                },
                teacher: {
                    _id: teacher._id,
                    name: teacher.name,
                }
            }
            const cart = await Cart.findOne({'customer._id': _id});
            if(!cart) throw new Error('cart does not exist!');

            cart.items.push({...data})

            const result = await cart.save();
            return result._doc || result;
        } catch(err){
            throw err;
        }
    },

    removeFromCart: async(courseInfo, userInfo)=>{
        const {_id} = userInfo;
        const {_id: courseId} = courseInfo;
        try {
            const cart = await Cart.findOne({'customer._id': _id});
            if(!cart) throw new Error('cart does not exist!');

            const {items} = cart;
            items.forEach((item, index)=>{
                if(item._id === courseId)
                    return items.splice(index);
            })

            const result = await cart.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },

    getAllCarts: async(id)=>{
        try {
            const carts = await Cart.findOne({'customer._id': id});
            if(!carts) throw new Error('cart does not exist!');

            return carts._doc || carts;
        } catch(err) {
            throw err;
        }
    },

    removeCartsByUserId: async(id)=>{
        try {
            const carts = await Cart.findOneAndUpdate({'customer._id': id}, {
                $set: {
                    items: []
                }
            });
            if(!carts) throw new Error('cart does not exist!');

            return carts._doc || carts;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = cartRepository;