const {EventController} = require('./../controller');

function eventApi(app, conn){
    try {
        const eventController = new EventController(conn);
        //receive data from QUEUE
        eventController.accountChanged();
        eventController.assistantStateChanged();
        eventController.courseChanged();
    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = eventApi;