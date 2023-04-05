const {teacherCensorRepository, adminCensorRepository} = require('../database')

const censorFactory = {
    createCensor: (kind)=>{
        switch(kind){
            case "educator":
                return teacherCensorRepository;
            case "admin":
                return adminCensorRepository;
            default:
                return null;
        }
    }
}

module.exports = censorFactory;