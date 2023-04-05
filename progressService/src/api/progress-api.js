const {ProgressController} = require('./../controller');
const {authorizationMDW, checkAuthorMDW} = require('./../middleware');

function progressApi(app, conn){
    try {
        const progressController = new ProgressController(conn);

        //student learning
        // /progress/:courseId
        app.get(
            '/progress/studying/:courseId',
            authorizationMDW.checkUser,
            checkAuthorMDW.studentAuthor,
            progressController.getCourse
        )
         // /progress/:courseId/:lessonId=...
         app.get(
            '/progress/studying/:courseId/:lessonId',
            authorizationMDW.checkUser,
            checkAuthorMDW.studentAuthor,
            progressController.getLesson
        );
        // /progress/:courseId?lessonId=...&kind=...
        app.post(
            '/progress/studying/:courseId',
            authorizationMDW.checkUser,
            checkAuthorMDW.studentAuthor,
            progressController.updatePersonalLesson
        );

        //download ranking pdf file

        // /progress/:courseId?lessonId=...&kind=...
        app.put(
            '/progress/studying/:courseId',
            authorizationMDW.checkUser,
            checkAuthorMDW.studentAuthor,
            progressController.downloadRankingPdfFile
        )
        //teaching
         
        // /progress/teaching/:courseId?lessonId=...&studentId=... ->get personal submit
        app.get(
            '/progress/teaching/:courseId',
            authorizationMDW.checkPermission,
            checkAuthorMDW.teacherAuthor,
            progressController.getPersonalSubmit
        )

        // /progress/teaching/:courseId -> get all submit
        app.get(
            '/progress/teaching/:courseId',
            authorizationMDW.checkPermission,
            checkAuthorMDW.teacherAuthor,
            progressController.getAllSubmit
        )
        
        // when deadline is reached, System will automatically make score for student without sending for
        // educator to do this. So educator doesn't save any thing for this test
        // /progress/teaching/:courseId?lessonId=...&studentId=...
        app.post(
            '/progress/teaching/:courseId',
            authorizationMDW.checkPermission,
            checkAuthorMDW.teacherAuthor,
            progressController.makeScoreForStudent
        )

    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = progressApi;