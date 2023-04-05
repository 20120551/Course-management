const {
    GenerateSalt, 
    GeneratePassword,
    ValidatePassword,
    GenerateSignature,
    GenerateToken,
    VerifyToken,
    FormatData,
    ValidateSignature
} = require('./handleData');

const {
    otpConfirm,
    otpMailSending,
} = require('./handleOtpMail');

module.exports = {
    GenerateSalt, 
    GeneratePassword,
    ValidatePassword,
    GenerateSignature,
    GenerateToken,
    VerifyToken,
    FormatData,
    otpConfirm,
    otpMailSending,
    ValidateSignature
}