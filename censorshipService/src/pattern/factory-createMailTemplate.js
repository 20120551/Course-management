const {
    interviewingMail,
    approveMail,
    rejectMail
} = require('./../utils/mailTemplate');

const createMailTemplate = {
    createTemplateMail: (type)=>{
        switch(type) {
            case 'INTERVIEWING': 
                return interviewingMail;
            case 'APPROVE': 
                return approveMail;
            case 'REJECT':
                return rejectMail;
        }
    }
}

module.exports = createMailTemplate;