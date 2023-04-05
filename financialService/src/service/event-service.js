const { FormatData } = require('../utils');
const {financialRepository} = require('./../database');
const {event} = require('./../constant')

const eventService = {
    transferBudget: async(sourceInfo, desInfo)=>{
        try {
            const financialHistory = await financialRepository.transferBudget(sourceInfo, desInfo);
            return FormatData({financialHistory});
        } catch(err){
            console.log('error here');
            throw err;
        }
    },
    accountChanged: async(userInfo, userEvent)=>{
        try {
            switch(userEvent) {
                case event.user.CREATE_ACCOUNT:
                    await financialRepository.createFinancial(userInfo);
                default: 
                    await financialRepository.updateFinancialAccount(userInfo);
            }
        } catch(err){
            throw err;
        }
    }
}

module.exports = eventService;