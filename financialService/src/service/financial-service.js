const { FormatData } = require('../utils');
const {financialRepository} = require('./../database');

const financialService = {
    rechargeBudget: async(money, userInfo)=>{
        try {
            const financial = await financialRepository.rechargeBudget(money, userInfo);
            return FormatData({financial});
        } catch(err) {
            throw err;
        }
    },
}

module.exports = financialService;