const {CourseController} = require('./../controller');
const {authorizationMDW, accessPermissionMDW} = require('./../middleware');

function courseApi(app, conn) {
    const courseController = new CourseController(conn);
    app.get(
        '/course/:id', 
        courseController.getCourse
    );
    app.get(
        '/course', 
        courseController.getAllCourses
    );

    app.post(
        '/course/create-course', 
        authorizationMDW.checkPermission,
        courseController.createCourse
    );
    app.put(
        '/course/:id/update-course', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.updateCourse
    );

    //here
    app.put(
        '/course/:id/delete-course', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.deleteCourse
    );
    app.delete(
        '/course/:id/destroy-course', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.destroyCourse
    );
    app.put(
        '/course/:id/restore-course', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.restoreCourse
    );

    app.post(
        '/course/:id/create-chapter', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.createChapter
    );
    
    //all here -> /course/:id/update-chapter?index=...
    app.put(
        '/course/:id/update-chapter', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.updateChapter
    );
    // /course/:id/delete-chapter?index=...
    app.delete(
        '/course/:id/delete-chapter',
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.deleteChapter
    )
    
    // /course/:id/:lessonId
    app.get(
        '/course/:id/:lessonId',
        authorizationMDW.checkUser, 
        accessPermissionMDW.courseAccessed, 
        courseController.getLesson
    )
    
    //all here -> /course/:id/create-lesson?index=...
    app.post(
        '/course/:id/create-lesson', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.createLesson
    );
    ///course/:id/update-lesson?lessonId=fasn8213fasj
    app.put(
        '/course/:id/update-lesson', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.updateLesson
    );

    //course/:id/delete-lesson?lessonID=ndjankdas&type='LECTURE'
    app.put(
        '/course/:id/delete-lesson', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.deleteLesson
    );
    app.delete(
        '/course/:id/destroy-lesson', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.destroyLesson
    );
    app.put(
        '/course/:id/restore-lesson', 
        authorizationMDW.checkPermission, 
        accessPermissionMDW.courseAccessed, 
        courseController.restoreLesson
    );

    app.put(
        '/course/:id/wishlist',
        authorizationMDW.checkUser, 
        courseController.addCourseToWishlist
    );
    app.delete(
        '/course/:id/wishlist',
        authorizationMDW.checkUser,
        courseController.deleteCourseInWishlist
    );
    app.put(
        '/course/:id/cart',
        authorizationMDW.checkUser, 
        courseController.addCourseToCart
    );
    app.delete(
        '/course/:id/cart',
        authorizationMDW.checkUser,
        courseController.deleteCourseInCart
    );
    app.post(
        '/course/:id/request-rating',
        authorizationMDW.checkUser,
        courseController.requestRatingCourse
    )
}

module.exports = courseApi;