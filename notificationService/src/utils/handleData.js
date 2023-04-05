const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN, REFRESH_TOKEN } = require('../config');

//config length of salt
const saltAround = 10;

//generate salt to hash
module.exports.GenerateSalt = async()=>{
    return await bcrypt.genSalt(saltAround);
}

//generate hash password
module.exports.GeneratePassword = async(password, salt)=>{
    return await bcrypt.hash(password, salt);
}

//validation enter password and hash password stored in database
module.exports.ValidatePassword = async(enterPassword, hashPassword)=>{
    const match = await bcrypt.compare(enterPassword, hashPassword);
    if(match) return true;
    return false;
}

//generate token
module.exports.GenerateSignature = (payload)=> {
    const {_id, username, listOfPermissions, userType, isActive} = payload;

    const {name, image, description} = userType;

    const accessToken = jwt.sign({
        _id, 
        username, 
        listOfPermissions, 
        isActive,
        name,
        image, 
        description
    }, ACCESS_TOKEN, {expiresIn: '30d'});

    const refreshToken = jwt.sign({
        _id, 
        username, 
        listOfPermissions, 
        isActive,
        name,
        image, 
        description
    }, REFRESH_TOKEN, {expiresIn: '30d'});

    return {accessToken, refreshToken};
}

//generate active Token
module.exports.GenerateToken = (payload, encode)=> {
    const activeToken = jwt.sign({...payload}, encode, {expiresIn: '30m'});
    return activeToken;
}

//validation signature
module.exports.ValidateSignature = (req)=>{
    const token = req.headers.token;
    //check valid of token
    if(token) {
        try {
    
            const accessToken = token.split(' ')[1];
    
            //verify token
            const decode = jwt.verify(accessToken, ACCESS_TOKEN);

            //get access token
            req.user = decode;
            return true;
        }
        catch(err){
            return false;
        }
    }
}

//random number 
module.exports.RandomNumber = (quantityNumber)=>{
    return parseInt(Math.random() * 10**quantityNumber);
}

//verify token
module.exports.VerifyToken = (token, decode)=>{
    return jwt.verify(token, decode);
}

//format data
module.exports.FormatData = (data)=>{
    if(data) {
        return { ...data };
    }
    throw new Error('Data Not found!');
}


