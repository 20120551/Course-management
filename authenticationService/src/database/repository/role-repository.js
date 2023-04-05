const {Role} = require('./../model');

const roleRepository = {
    findRoleByName: async(roleName)=> {
        try {
            const role = await Role.findOne({roleName: roleName});
            if(!role) throw new Error('role does not exist!');

            return role || role;
        } catch(err){
            throw err;
        }
    },
    findRoleById: async(id)=> {
        try {
            const role = await Role.findById({_id: id});
            if(!role) throw new Error('role does not exist!');

            return role || role;
        } catch(err){
            throw err;
        }
    },
    findRoleByNames: async(names)=>{
        try {
            const roles = await Role.find({
                'roleName': {
                    $in: names
                }
            })

            if(!roles) throw new Error('roles does not exist!');

            return roles || roles;
        } catch(err){
            throw err;
        }
    },
    findRoleByIds: async(ids)=>{
        try {
            const roles = await Role.find({
                '_id': {
                    $in: ids
                }
            }).populate('permission');

            if(!roles) throw new Error('roles does not exist!');

            return roles || roles;
        } catch(err){
            throw err;
        }
    }
}

module.exports = roleRepository;