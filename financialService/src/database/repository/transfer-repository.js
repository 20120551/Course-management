const {Transfer} = require('./../model');


const transferRepository = {
    createTransfer: async({money, destination, source, status, purpose})=>{
        try {
            const transfer = new Transfer({
                money,
                source,
                destination,
                status,
                purpose
            });

            const result = await transfer.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = transferRepository;