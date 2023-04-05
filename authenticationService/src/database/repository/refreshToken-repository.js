const { RefreshToken } = require('./../model');

const refreshTokenRepository = {
    findByToken: async(token)=>{
        try {
            const tk = await RefreshToken.findOne({refreshToken: token});
            if(!tk) throw new Error('this token doest not exist!');

            return tk._doc || tk;
        } catch(err) {
            throw err;
        }
    },
    createToken: async(token)=>{
        try {
            const refreshToken = new RefreshToken({
                refreshToken: token
            })
            const tk = await refreshToken.save();
            return tk._doc || tk;
        } catch(err) {
            throw err;
        }
    },
    deleteByToken: async(token)=>{
        try {
            await RefreshToken.deleteOne({refreshToken: token});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = refreshTokenRepository;