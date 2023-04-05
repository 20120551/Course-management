const {eventServiceProxy} = require('./../pattern');
const {queue} = require('./../constant');
const {logger} = require('./../lib');

class EventController {
    constructor(conn) {
        this.conn = conn;
    }

    courseChanged = async()=> {
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.COURSE_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());
                
                const {courseInfo, teacherInfo, event: courseEvent} = data;

                const time = await eventServiceProxy.courseChanged(courseInfo, teacherInfo, courseEvent);
                logger.info('Receive from [COURSE_CHANGED], event: [' + courseEvent + '], time: ' + time + 'ms');
            }, {noAck: true});

        } catch(err) {
            console.log('Receive from [COURSE_CHANGED], err: ', err);
        }
    }

    wishlistChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.WISHLIST_CHANGED);
            channel.consume(queue.WISHLIST_CHANGED, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userInfo, courseInfo, event} = data;
                const time = await eventServiceProxy.wishlistChanged(courseInfo, userInfo, event);
                logger.info('Receive from [WISHLIST_CHANGED], event: [' + event + '], time: ' + time + 'ms');
            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [WISHLIST_CHANGED], error: ', err);
        }
    }

    cartChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.CART_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.CART_CHANGED, '');


            channel.consume(q.queue, async(msg)=>{
                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());  

                const {userInfo, courseInfo, event} = data;

                const time = await eventServiceProxy.cartChanged(courseInfo, userInfo, event);
                logger.info('Receive from [CART_CHANGED], event: [' + event + '], time: ' + time + 'ms');
            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [CART_CHANGED], error: ', err);
        }
    }

    orderChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.ORDER_CHANGED);
            channel.consume(queue.ORDER_CHANGED, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {userInfo, orderInfo, event} = data;

                const time = await eventServiceProxy.orderChanged(userInfo, orderInfo, event);
                logger.info('Receive from [ORDER_CHANGED], event: [' + event + '], time: ' + time + 'ms');

            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [ORDER_CHANGED], error: ', err);
        }
    }

    budgetChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertQueue(queue.BUDGET_CHANGED);
            channel.consume(queue.BUDGET_CHANGED, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {state, finance, event} = data;

                const time = await eventServiceProxy.budgetChanged(finance, state, event);
                logger.info('Receive from [BUDGET_CHANGED], event: [' + event + '], time: ' + time + 'ms');

            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [BUDGET_CHANGED], error: ', err);
        }
    }

    progressChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.PROGRESS_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.PROGRESS_CHANGED, '');
            channel.consume(q.queue, async(msg)=>{

                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());

                const {coursesInfo, userInfo, event} = data;

                const time = await eventServiceProxy.progressChanged(coursesInfo, userInfo, event);
                logger.info('Receive from [PROGRESS_CHANGED], event: [' + event + '], time: ' + time + 'ms');

            }, {noAck: true});
        } catch(err){
            logger.error('Receive from [PROGRESS_CHANGED], error: ', err);
        }
    }

    assistantChanged = async()=>{
        try {
            const channel = await this.conn.createChannel();

            //receive from QUEUE
            await channel.assertExchange(queue.ASSISTANT_CHANGED, 'fanout', { durable: false });
            const q = await channel.assertQueue('', {exclusive: true});

            channel.bindQueue(q.queue, queue.ASSISTANT_CHANGED, '');


            channel.consume(q.queue, async(msg)=>{
                if(!msg) throw new Error({message: 'Consumer cancelled by server'});
                
                const data = JSON.parse(msg.content.toString());  

                const {assistantInfo, courseInfo, event: assistantEvent} = data;

                const {_id} = assistantInfo;

                const time = await eventServiceProxy.assistantChanged(_id, courseInfo, assistantEvent);
                logger.info('Receive from [ASSISTANT_CHANGED], event: [' + assistantEvent + '], time: ' + time + 'ms');
            }, {noAck: true});
        } catch(err) {
            logger.error('Receive from [ASSISTANT_CHANGED], error: ', err);
        }
    }
}

module.exports = EventController;