const {EventController} = require('./../controller');

function eventApi(app, conn){
    try {
        const eventController = new EventController(conn);
        //receive data from QUEUE

        eventController.accountChanged();
        eventController.addStudentToCourse();
        eventController.courseChanged();
        eventController.assistantChanged();
        eventController.lessonChanged();
        eventController.chapterChanged();
    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = eventApi;