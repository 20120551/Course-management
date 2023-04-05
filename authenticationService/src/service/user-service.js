const {
    GenerateSignature,
    GenerateToken,
    GenerateSalt,
    GeneratePassword,
    VerifyToken,
    FormatData,
    ValidatePassword,
    otpConfirm,
    otpMailSending,
} = require('../utils');

const createAccountFactory = require('./../pattern/factory-createAccount');

const {REFRESH_TOKEN, ACTIVE_TOKEN, MAIL_EXCHANGE_TOKEN} = require('../config');
const authService = require('./auth-service');
const {
    userRepository, 
    refreshTokenRepository,
    addressRepository,
} = require('../database');

const userService = {
    otpActivateAccount: async({username, _id})=>{     
        try {
            const secretKey = await otpMailSending(username, 'ACTIVE');
    
            //create token
            const secretKeyToken = GenerateToken({secretKey, _id}, ACTIVE_TOKEN);
            //return
            return FormatData({secretKeyToken});
        } catch(err){
            throw err;
        }
    },
    activateAccount: async(key, activeKey)=>{
        try {
            const {secretKey, _id} = VerifyToken(activeKey, ACTIVE_TOKEN);
            await otpConfirm(key, secretKey);
    
            const kind = await userRepository.activeAccountById(_id);
            return FormatData({kind});
        } catch(err){
            throw err;
        }
    },
    requestRefreshToken: async(token)=>{
        try {  
            //check valid of token
            const tk = await refreshTokenRepository.findByToken(token);
    
            //refreshToken was fake
            if(!tk) throw new Error({message: "token was forbidden!"});
            
            //delete old refreshToken
            await refreshTokenRepository.deleteByToken(token);
    
            //verify token
            const payload = VerifyToken(token, REFRESH_TOKEN);
    
            //generate new token
            const {accessToken, refreshToken} = GenerateSignature(payload);
            
            //store new refreshToken
            await refreshTokenRepository.createToken(refreshToken);
    
            return FormatData({payload, accessToken, refreshToken});
    
        } catch(err){
            throw new Error(err);
        }
    },
    createAccount: async(userInput)=>{
        const {
            username, 
            password, 
            roles, 
            name,
            workPlace, 
            degree,
            sex,
            teaching,
        } = userInput;
        const repository = createAccountFactory.createAccountRepository(roles);
        console.log(repository)
        try {
            const account = await repository.createAccount({name, workPlace, degree,
                                                                     sex, teaching: JSON.parse(teaching)}); 
            try {
                //create user 
                const user = await authService.signUp({username, password, roles, userType: account._id});
                return FormatData({account, user});
            } catch(err) {
                await repository.deleteById(account._id);
                throw err;
            }
        } catch(err){
            throw err;
        }
    },
    viewProfile: async(id)=> {
        try {
            const user = await userRepository.getInformationById(id);
            return FormatData({userType: user.userType});
        } catch(err) {
            throw err;
        }
    },
    updateProfile: async(userInput)=>{
        const {
            _id,
            name, 
            birthDay, 
            facebook, 
            sex, 
            phoneNumber, 
            teaching = null, 
            description = null,
            degree, 
            commune, 
            district, 
            city
        } = userInput;
        try {
            //create new address
            const addressId = await addressRepository.createAddress({
                commune, 
                district, 
                city
            })

            //update info for user
            const user = await userRepository.updateInformationById({
                _id,
                name, 
                birthDay,
                facebook, 
                sex, 
                phoneNumber, 
                teaching: teaching && JSON.parse(teaching), 
                description: teaching && JSON.parse(description),
                degree, 
                addressId,
            })

            return FormatData({user});
        } catch(err) {
            throw err;
        }
    },
    getWishlistCourses: async(_id)=>{
        try {
            const wishlist = await userRepository.getWishlistCourses(_id);
            return FormatData({wishlist});
        } catch(err) {
            throw err;
        }
    },
    getCartCourses: async(_id)=>{
        try {
            const carts = await userRepository.getCartCourses(_id);
            return FormatData({carts});
        } catch(err) {
            throw err;
        }
    },
    getOrderCourses: async(_id)=>{
        try {
            const order = await userRepository.getOrderCourses(_id);
            return FormatData({order});
        } catch(err) {
            throw err;
        }
    },
    otpExchangePassword: async({_id, username, confirmPassword, newPassword})=>{
        try {
            const user = await userRepository.findById(_id);

            //verify password
            const isMatch = await ValidatePassword(confirmPassword, user.password);
            if(!isMatch) throw new Error({message: "your old password input was wrong!"});

            const secretKey = await otpMailSending(username, 'CHANGE_PASS_WORD');

            const salt = await GenerateSalt();
            const _password = await GeneratePassword(newPassword, salt);

            const secretKeyToken = GenerateToken({secretKey, newPassword: _password}, MAIL_EXCHANGE_TOKEN);
            return FormatData({secretKeyToken});
        } catch(err) {
            throw err;
        }
    },
    exchangePassword: async({_id, token, key})=>{
        try {
            const {newPassword, secretKey} = VerifyToken(token, MAIL_EXCHANGE_TOKEN);
            //check input key matched with secretKey
            await otpConfirm(key, secretKey);

            //change password
            await userRepository.updatePasswordById(_id, newPassword);
        } catch(err) {
            throw err;
        }
    },
    logout: async(token)=>{
        try {
            //delete old refreshToken
            await refreshTokenRepository.deleteByToken(token);
        } catch(err){
            throw new Error(err);
        }
    },
}

module.exports = userService;