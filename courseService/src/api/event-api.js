const {EventController} = require('./../controller');

function eventApi(app, conn){
    try {
        const eventController = new EventController(conn);

        //receive data from QUEUE
        eventController.accountChanged();
        eventController.enrollCourses();
        eventController.ratingStateChanged();
        eventController.courseStateChanged();
        eventController.assistantChanged();
        eventController.progressChanged();
    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = eventApi;