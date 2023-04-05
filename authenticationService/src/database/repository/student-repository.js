const { Student } = require('./../model');

const studentRepository = {
    createDefaultStudent: async()=>{
        try {
            const student = new Student({
                name: '',
                birthDay: '',
                facebook: '',
                phoneNumber: '',
            });

            const result = await student.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    }
}

module.exports = studentRepository;