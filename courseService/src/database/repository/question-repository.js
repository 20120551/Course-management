const {Question} = require('./../model');

const questionRepository = {
    createQuestion: async({
        question,
        answers
    })=>{
        try {
            const ques = new Question({
                question,
                answers
            })
            const result = await ques.save();
            
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    updateQuestion: async({
        _id,
        question,
        answers
    })=>{
        try {
            const result = await Question.findOneAndUpdate({_id: _id}, {
                question,
                answers
            })
            if(!result) throw new Error('question does not exist!');

            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    deleteQuestion: async({
        questionIds
    })=>{
        try {
            await Question.deleteMany({_id: {$in: questionIds}});
        } catch(err) {
            throw err;
        }
    }
}

module.exports = questionRepository;