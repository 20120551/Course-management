const {Recharge} = require('./../model');


const rechargeRepository = {
    createRecharge: async({money, destination, status, purpose})=>{
        try {
            const recharge = new Recharge({
                money,
                destination,
                status,
                purpose
            });

            const result = await recharge.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = rechargeRepository;