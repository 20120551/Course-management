const {userRepository} = require('./../database');
const {event} = require('./../constant');

const {
    FormatData
} = require('./../utils');

const eventService = {
    courseChanged: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            switch(courseEvent) {
                case event.course.CREATE_COURSE:
                    await userRepository.createCourse(courseInfo, teacherInfo);
                    break;
                case event.course.DESTROY_COURSE:
                    await userRepository.destroyCourse(courseInfo, teacherInfo)
                    break;
                default:
                    await userRepository.updateCourse(courseInfo, teacherInfo);
                    break;
            }
        } catch(err){
            throw err;
        }
    },
    wishlistChanged: async(courseInfo, userInfo, wishlistEvent)=>{
        try {
            switch(wishlistEvent) {
                case event.wishlist.ADD_TO_WISHLIST:
                    await userRepository.addToWishlist(courseInfo, userInfo);
                    break;
                case event.wishlist.REMOVE_TO_WISHLIST:
                    await userRepository.removeToWishlist(courseInfo, userInfo);
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
                    await userRepository.addToCart(courseInfo, userInfo);
                    break;
                case event.cart.REMOVE_TO_CART:
                    await userRepository.removeToCart(courseInfo, userInfo);
                    break;
                case event.cart.REMOVE_ALL_CART:
                    await userRepository.removeAllCart(courseInfo, userInfo);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    orderChanged: async(userInfo, orderInfo, orderEvent)=>{
        try {
            switch(orderEvent) {
                case event.order.ADD_TO_ORDER:
                    await userRepository.addToOrder(userInfo, orderInfo);
                    break;
                case event.order.UPDATE_IN_ORDER:
                    await userRepository.updateInOrder(userInfo, orderInfo);
                    break;
                case event.order.REMOVE_FROM_ORDER:
                    await userRepository.removeFromOrder(userInfo, orderInfo);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    budgetChanged: async(finance, state, budgetEvent)=>{
        try {
            switch(budgetEvent) {
                case event.budget.RECHARGE_BUDGET:
                    await userRepository.UpdateRechargeHistory(finance, state);
                    break;
                case event.budget.TRANSFER_BUDGET:
                    finance.forEach(async(item)=>{
                        const {
                            sourceFinance,
                            desFinance,
                        } = item;
        
                        await userRepository.UpdateTransferHistory(sourceFinance, state);
                        await userRepository.UpdateTransferHistory(desFinance, state);
                    });
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    progressChanged: async(courseInfo, userInfo, progressEvent)=>{
        try {
            switch(progressEvent) {
                case event.progress.ADD_COURSE_TO_PROGRESS:
                    await userRepository.addCourseToProgress(userInfo, courseInfo);
                    break;
                case event.progress.EXPIRE_COURSE_IN_PROGRESS:
                    await userRepository.deleteCourseFromProgress(userInfo._id, courseInfo._id);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    assistantChanged: async(assistantId, courseInfo, assistantEvent)=>{
        try {
            switch(assistantEvent) {
                case event.assistant.ADD_ASSISTANT_TO_SERVICE:
                    await userRepository.addCourseToAssistant(assistantId, courseInfo);
                    break;
                case event.assistant.EXPIRE_ASSISTANT_CONTRACT:
                    await userRepository.expireAssistantContract(assistantId, courseInfo)
                    break;
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventService;