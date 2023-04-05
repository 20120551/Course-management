const { Educator } = require('../model');

const educatorRepository = {
    createAccount: async({
        name, 
        workPlace, 
        degree,
        sex,
        teaching,
    })=>{
        try {
            const educator = new Educator({
                name: name,
                workPlace: workPlace,
                degree: degree,
                sex: sex,
                teaching: [...teaching]
            });

            const result = await educator.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    deleteById: async(_id)=>{
        try {
            await Educator.deleteOne({_id: _id});
        } catch(err) {
            throw err;
        }
    },
}

module.exports = educatorRepository;