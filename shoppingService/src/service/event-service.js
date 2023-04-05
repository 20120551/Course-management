const {event} = require('./../constant');
const {cartRepository} = require('./../database'); 
const {FormatData} = require('./../utils');

const eventService = {
    accountChanged: async(userInfo, userEvent)=>{
        try {
            switch(userEvent) {
                case event.user.CREATE_ACCOUNT:
                    await cartRepository.createAccount(userInfo);
                    break;
                case event.user.STUDENT_UPDATED:
                    await cartRepository.updateAccount(userInfo);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    cartChanged: async(courseInfo, userInfo, cartEvent)=>{
        try {
            switch(cartEvent) {
                case event.cart.ADD_TO_CART:
                    await cartRepository.createCart(courseInfo, userInfo);
                    break;
                case event.cart.REMOVE_TO_CART:
                    await cartRepository.removeFromCart(courseInfo, userInfo);
                    break;
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventService;