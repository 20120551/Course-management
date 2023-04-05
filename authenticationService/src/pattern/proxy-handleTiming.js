const {performance} = require('perf_hooks');
const {eventService } = require('./../service');

const eventServiceProxy = {
    courseChanged: async(courseInfo, teacherInfo, courseEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.courseChanged(courseInfo, teacherInfo, courseEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err){
            throw err;
        }
    },
    wishlistChanged: async(courseInfo, userInfo, wishlistEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.wishlistChanged(courseInfo, userInfo, wishlistEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err){
            throw err;
        }
    },
    cartChanged: async(courseInfo, userInfo, cartEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.cartChanged(courseInfo, userInfo, cartEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err){
            throw err;
        }
    },
    orderChanged: async(userInfo, orderInfo, orderEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.orderChanged(userInfo, orderInfo, orderEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err){
            throw err;
        }
    },
    budgetChanged: async(finance, state, budgetEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.budgetChanged(finance, state, budgetEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err){
            throw err;
        }
    },
    progressChanged: async(courseInfo, userInfo, progressEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.progressChanged(courseInfo, userInfo, progressEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err) {
            throw err;
        }
    },

    assistantChanged: async(assistantId, courseInfo, assistantEvent)=>{
        try {
            const t1 = performance.now();
            await eventService.assistantChanged(assistantId, courseInfo, assistantEvent);
            const t2 =  performance.now();
            return t2 - t1;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventServiceProxy;