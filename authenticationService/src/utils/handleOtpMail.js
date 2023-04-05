const mg = require('./../config/mailgun');
const {transporter} = require('./../lib');
const {GenerateSalt, GeneratePassword, ValidatePassword} = require('./handleData');
const createMailTemplate = require('./../pattern/factory-createMailTemplate');

//otp sending
module.exports.otpMailSending = async(email, type)=>{
    try {
        const template = createMailTemplate.createTemplateMail(type);
        const {key, data} = template(email);

        //send data to mail
        //await mg.messages().send(data);
        await transporter.sendMail(data);

        //create salt
        const salt = await GenerateSalt();

        //create new key
        const secretKey = await GeneratePassword(key.toString(), salt);

        return secretKey;
    } catch(err){
        throw err;
    }
}

//otp confirm
module.exports.otpConfirm = async(key, secretKey)=>{
    try {
        const active = await ValidatePassword(key, secretKey);
        
        if(!active) throw new Error("your input was wrong!");   

        return active;
    } catch(err){
        throw new Error(err);
    }
}