const {
    GenerateSalt, 
    GeneratePassword,
    ValidatePassword,
    GenerateSignature,
    GenerateToken,
    VerifyToken,
    FormatData,
    otpMailSending,
    otpConfirm,
} = require('../utils');

const { MAIL_EXCHANGE_TOKEN, USER_ID_TOKEN } = require('../config');
const {userRepository, roleRepository, refreshTokenRepository, studentRepository} = require('../database');

const authService = {
    signUp: async(userInput)=> {
        const {username, password, roles = '["STUDENT"]', userType = null} = userInput;
        try {
            //check exists username
            const isExistsUser = await userRepository.findByUsername(username);
            if(isExistsUser) {
                throw new Error("user has existed!");
            }

            const salt = await GenerateSalt();
            const _password=  await GeneratePassword(password, salt);

            //if roles is null, you do nothing, else you map your roles and
            //create it in userRoleIds

            let roleIds = await roleRepository.findRoleByNames(JSON.parse(roles));
            const kinds = roleIds.map((role)=>role.roleName);

            //handle data to create new user
            
            //role
            const roleId = roleIds.map((role)=>role._id);  
            //kind
            let kind = ((kinds.includes('TEACHER') || kinds.includes('ASSISTANT')) ? 'educator' : kinds[0].toLowerCase());
            //userId
            const userId = userType || (await studentRepository.createDefaultStudent())._id;

            const user = await userRepository.createUser({ 
                username, 
                password: _password, 
                roles: roleId, 
                kind,
                userType: userId
            });

            return FormatData({user});
        } catch(err) {
            throw new Error(err);
        }
    },
    login: async(userInput)=>{
        const {username, password} = userInput;
        try {
            //check username has existed
            const user = await userRepository.findByUsername(username);

            //check username
            if(!user) throw new Error("user wasn't existed!");

            const validPassword = await ValidatePassword(password, user.password);
            //check password
            if(!validPassword) throw new Error("password was incorrect!");

            //get list permission to attach to access token and refresh token
            const roles = await roleRepository.findRoleByIds(user.roleIds);
            let listOfPermissions = [];
            roles.map((role)=>{
                listOfPermissions = [...listOfPermissions, ...role.permission];
            })

            const {password: _password, ...payload} = user._doc;
            payload.listOfPermissions = listOfPermissions;
                    
            //create token
            const {accessToken, refreshToken} = GenerateSignature(payload);

            //store refreshToken
            await refreshTokenRepository.createToken(refreshToken);
            
            return FormatData({payload, accessToken, refreshToken});
        } catch(err) {
            throw new Error(err);
        }
    },
    forgotPassword: async(username)=>{
        try {
            const user = await userRepository.findByUsername(username);

            //check username
            if(!user) throw new Error('your username was not found!');

            const secretKey = await otpMailSending(username, 'CHANGE_PASS_WORD');

            const {password, roleIds, _id, ...payload} = user._doc;
            //create token
            const secretKeyToken = GenerateToken({secretKey, _id}, MAIL_EXCHANGE_TOKEN);

            //return
            return FormatData({secretKeyToken});
        }catch(err){
            throw new Error(err);
        }
    },
    otpExchangePassword: async(key, token)=>{
        try {
            const {secretKey, _id} = VerifyToken(token, MAIL_EXCHANGE_TOKEN);

            await otpConfirm(key, secretKey);
            //confirm otp key for _id
            const userIdToken = GenerateToken({_id}, USER_ID_TOKEN);
            
            return FormatData({userIdToken});
        } catch(err){
            throw new Error(err);
        }
    },
    exchangePassword: async(userId, password)=>{
        try {
            const {_id} = VerifyToken(userId, USER_ID_TOKEN);

            const salt = await GenerateSalt();
            const _password=  await GeneratePassword(password, salt);

            await userRepository.updatePasswordById(_id, _password);
        } catch(err){
            throw new Error(err);
        }
    }
}

module.exports = authService;