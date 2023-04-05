const adminRepository = require('./../database/repository/admin-repository');
const educatorRepository = require('./../database/repository/educator-repository');


const createAccountFactory = {
    createAccountRepository: (roles)=>{
        if(JSON.parse(roles).includes('ADMIN'))
            return adminRepository;
        else
            return educatorRepository;
    },
}

module.exports = createAccountFactory;