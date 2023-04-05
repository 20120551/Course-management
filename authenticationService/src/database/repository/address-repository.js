const { Address } = require('./../model');

const AddressRepository = {
    createAddress: async({
        commune, 
        district, 
        city
    })=>{
        try {
            let address = null;
            address = await Address.findOne({commune: commune, district: district, city: city});
            if(address) {
               return address._id; 
            }
            //create new address
            address = new Address({
                commune, 
                district, 
                city
            });
    
            const result = await address.save();
            return result._id;
        } catch(err) {
            throw err;
        }
    },
    updateAddressById: async({
        _id,
        commune, 
        district, 
        city
    })=>{
        await Address.updateOne({_id: _id}, {
            commune: commune, 
            district: district, 
            district: city
        })
    }
}

module.exports = AddressRepository;