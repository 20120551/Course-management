const { PermissionResource } = require('./../model');

const permissionRepository = {
    createPermission: async(name, code)=>{
        try {
            const permission = new PermissionResource({
                name: name,
                code: code
            })
    
            const result = await permission.save();
            return result._doc || result;
        } catch(err){
            throw err;
        }
    },
    findPermissionByIds: async(ids)=>{
        try {
            return await PermissionResource.find({
                '_id': {
                    $in: ids
                }
            });
        } catch(err){
            throw err;
        }
    }

}

module.exports = permissionRepository;