const { Admin } = require('../model');
const {RandomNumber} = require('./../../utils');

const adminRepository = {
    createAccount: async()=>{
        try {
            const admin = new Admin({
                name: `ADMIN-${RandomNumber(5)}`,
            });

            const result = await admin.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    deleteById: async(_id)=>{
        try {
            await Admin.deleteOne({_id: _id});
        } catch(err) {
            throw err;
        }
    },
}

module.exports = adminRepository;