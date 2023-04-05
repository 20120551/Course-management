const {AuthController} = require('../controller');

module.exports = (app)=>{
    const authController = new AuthController();
    
    app.post('/auth/signup', authController.signUp);
    app.post('/auth/login', authController.login);
    app.post('/auth/forgot-password', authController.forgotPassword);
    app.post('/auth/otp-exchange-password', authController.otpExchangePassword);
    app.post('/auth/exchange-password', authController.exchangePassword);
}