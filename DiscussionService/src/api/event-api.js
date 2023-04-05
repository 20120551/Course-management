const {EventController} = require('./../controller');

function eventApi(app, conn){
    try {
        const eventController = new EventController(conn);
        //receive data from QUEUE

        //account changed
        eventController.accountChanged();
        //course changed
        eventController.courseChanged();
        //lesson changed
        eventController.lessonChanged();
        //assistant changed
        eventController.assistantChanged();
        //chapter changed
        eventController.chapterChanged();
    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = eventApi;