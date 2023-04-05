const {RecruitController} = require('./../controller');
const {authorizationMDW} = require('./../middleware');

function recruitApi(app, conn){
    try {
        const recruitController = new RecruitController(conn);
        //receive data from QUEUE

        app.get(
            '/recruit/get-all-recruits',
            authorizationMDW.checkPermission,
            recruitController.getAllRecruits
        );

        // /recruit/get-recruits?courseId=...
        app.get(
            '/recruit/get-recruit',
            authorizationMDW.checkPermission,
            recruitController.getRecruit
        );

        app.get(
            '/recruit/get-personal-recruits',
            authorizationMDW.checkPermission,
            recruitController.getPersonalRecruits
        );

        // /recruit/update-recruit?courseId=...
        app.post(
            '/recruit/update-recruit',
            authorizationMDW.checkPermission,
            authorizationMDW.checkAuthor,
            recruitController.updateRecruit
        );

        // /recruit/request-assistant?courseId=...
        app.post(
            '/recruit/request-assistant',
            authorizationMDW.checkPermission,
            authorizationMDW.validTimeApply,
            recruitController.requestAssistant
        );

        // /recruit/cancel-assistant?courseId=...
        app.post(
            '/recruit/cancel-assistant',
            authorizationMDW.checkPermission,
            authorizationMDW.validTimeApply,
            recruitController.cancelAssistant
        )
    } catch(err) {
        console.log('something wrong here!');
    }
}

module.exports = recruitApi;