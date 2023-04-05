const {
    activateMail,
    changePassMail
} = require('./../utils/mailTemplate');

const createMailTemplate = {
    createTemplateMail: (type)=>{
        switch(type) {
            case 'ACTIVE': 
                return activateMail;
            case 'CHANGE_PASS_WORD': 
                return changePassMail;
        }
    }
}

module.exports = createMailTemplate;