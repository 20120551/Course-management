const {UserController} = require('../controller');
const {authorizationMDW} = require('../middleware');

module.exports = (app, conn)=>{
    const userController = new UserController(conn);
    
    app.post('/user/refreshToken', userController.requestRefreshToken);
    app.post('/user/otp-active-account',authorizationMDW.checkUser, userController.otpActivateAccount);
    app.post('/user/active-account',authorizationMDW.checkUser, userController.activateAccount);
    app.post('/user/logout',authorizationMDW.checkUser, userController.logout);
    app.post('/user/create-account', authorizationMDW.checkPermission, userController.createAccount);

    app.get('/user/profile', authorizationMDW.checkUser, userController.viewProfile);
    app.post('/user/update-profile', authorizationMDW.checkUser, userController.updateProfile);
    app.post('/user/otp-exchange-password', authorizationMDW.checkUser, userController.otpExchangePassword);
    app.post('/user/exchange-password', authorizationMDW.checkUser, userController.exchangePassword);
    app.get('/user/wishlist', authorizationMDW.checkUser, userController.getWishlistCourses);
    app.get('/user/cart', authorizationMDW.checkUser, userController.getCartCourses);
    app.get('/user/order', authorizationMDW.checkUser, userController.getOrderCourses);
}