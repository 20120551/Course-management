const {EventController} = require('./../controller');

function eventApi(app, conn){
    try {
        const eventController = new EventController(conn);

        //receive data from QUEUE
        eventController.courseChanged();
        eventController.wishlistChanged();
        eventController.cartChanged();
        eventController.orderChanged();
        eventController.budgetChanged();
        eventController.progressChanged();
        eventController.assistantChanged();
    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = eventApi;