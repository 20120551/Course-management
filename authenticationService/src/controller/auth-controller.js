const {authService} = require('../service')
const {status, queue} = require('../constant');

class AuthController {
    constructor(conn) {
        this.conn = conn;
    }
    async signUp(req, res){
        try{
            //get database from client input
            const {username, password, roles, userType} = req.body;

            //signup business logic
            const user = await authService.signUp({username, password, roles, userType});

            res.status(status.OK).json(user);
        }catch(error) {
            res.status(status.INTERNAL_ERROR).json(error.message);
        }
    }

    //[POST] /auth/login
    async login(req, res){
        try{
            //get database from client input
            const {username, password} = req.body;
            //get accessToken and refreshToken
            const {payload, accessToken, refreshToken} = await authService.login({username, password});

            res.cookie('refreshToken', refreshToken, {
                secure: false,
                httpOnly: true,
                sameSite: "strict",
            });

            res.status(status.OK).json({...payload, accessToken})
        } catch(error){
            res.status(status.UN_AUTHENTICATE).json(error.message);
        }
    }
    async forgotPassword(req, res){
        try {
            const {username} = req.body;
            const {secretKeyToken} = await authService.forgotPassword(username);

            //set secret key in cookie
            res.cookie('secretKey', secretKeyToken, {
                secure: false,
                httpOnly: true,
                sameSite: "strict",
            });

            res.status(status.OK).json(`key to active ${secretKeyToken}`);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    async otpExchangePassword(req, res){
       try {
            const { key } = req.body;
            const exchangePasswordKey = req.cookies.secretKey;

            const {userIdToken} = await authService.otpExchangePassword(key, exchangePasswordKey);

            //clear cookie
            res.clearCookie("secretKey");

            //set user id in cookie
            res.cookie('user_id', userIdToken, {
                secure: false,
                httpOnly: true,
                sameSite: "strict",
            })
            
            res.status(status.OK).json("verify successfully!");
       } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    async exchangePassword(req, res){
        try {
            const {password} = req.body;
            const userId = req.cookies.user_id;

            //call service
            await authService.exchangePassword(userId, password);

            //clear cookie
            res.clearCookie("user_id");

            res.status(status.OK).json("change password successfully!");
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    
}

module.exports = AuthController;