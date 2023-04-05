const {CensorController} = require('../controller');
const {authorizationMDW, accessPermissionMDW} = require('../middleware');

module.exports = (app, conn)=>{
    const censorController = new CensorController(conn);
    
    // /censor/assistant/:courseId
    app.get(
        '/censor/assistant/:courseId',
        authorizationMDW.checkPermission,
        accessPermissionMDW.courseAccessed,
        censorController.getAllAssistantRequest
    )
    app.post(
        '/censor/assistant/:courseId/:assistantId',
        authorizationMDW.checkPermission,
        accessPermissionMDW.courseAccessed,
        censorController.updateAssistantState
    );

    // /censor/:courseId/:assistantId
    app.delete(
        '/censor/assistant/:courseId/:assistantId',
        authorizationMDW.checkPermission,
        accessPermissionMDW.courseAccessed,
        censorController.cancelAssistantRequest
    )

    // /censor/rating/:courseId
    app.get(
        '/censor/rating/:courseId',
        authorizationMDW.checkPermission,
        accessPermissionMDW.courseAccessed,
        censorController.getAllRatingRequest
    )
    // /censor/:courseId/:studentId
    app.post(
        '/censor/rating/:courseId/:studentId',
        authorizationMDW.checkPermission,
        accessPermissionMDW.courseAccessed,
        censorController.updateRatingState
    );

    // /censor/:courseId
    app.delete(
        '/censor/rating/:courseId/:studentId',
        authorizationMDW.checkPermission,
        accessPermissionMDW.courseAccessed,
        censorController.cancelRatingRequest
    )
    app.get(
        '/censor/my-course',
        authorizationMDW.checkPermission,
        censorController.getPersonalCourse
    )
    // /censor/course?state=...
    app.get(
        '/censor/course',
        authorizationMDW.checkPermission,
        censorController.getAllCoursesRequest
    )
    // /censor/:courseId
    app.post(
        '/censor/course/:courseId',
        authorizationMDW.checkPermission,
        censorController.acceptCourseRequest
    );

    // /censor/:courseId
    app.delete(
        '/censor/course/:courseId',
        authorizationMDW.checkPermission,
        censorController.cancelCourseRequest
    )
}