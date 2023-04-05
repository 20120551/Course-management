const { FormatData } = require('../utils');
const {notifyRepository} = require('./../database');
const {event} = require('./../constant')

const eventService = {
    accountChanged: async (userInfo, kind, userEvent)=>{
        try {
            switch(userEvent) {
                case event.user.CREATE_ACCOUNT:
                    await notifyRepository.createAccount(userInfo);
                    break;
                default:
                    await notifyRepository.updateProfile(userInfo);
                    break;
            }
        } catch(err) {
            throw err;
        }
    },
    notificationChanged: async(dataInfo, userInfo, message, notifyEvent)=>{
        const {
            censor,
            course,
            expire,
            comment,
            order,
            rank
        } = event.notify;
        try {
            switch(notifyEvent) {
                //...receive from censor service...//
                case    censor.ASSISTANT_INTERVIEWING:
                case    censor.ASSISTANT_APPROVE:
                case    censor.ASSISTANT_REJECT:
                    await notifyRepository.assistantStateChanged(dataInfo, {...userInfo, state: notifyEvent.split('_')[1]}, message)
                    break;
                case    censor.COURSE_APPROVE:
                case    censor.COURSE_REJECT:
                    await notifyRepository.courseStateChanged(dataInfo, userInfo, message);
                    break;
                //...receive from course service...//
                case    course.CREATE_EXERCISE:
                case    course.CREATE_LECTURE:
                    await notifyRepository.lessonChanged(dataInfo, userInfo, message);
                    break;
                //...receive from progress service...//
                case    expire.EXPIRE_ASSISTANT:
                case    expire.EXPIRE_STUDENT:
                    await notifyRepository.expireChanged(dataInfo, {...userInfo, type: notifyEvent.split('_')[1]}, message);
                    break;
                case    rank.SCORED_COMPLETELY:
                    await notifyRepository.rankChanged(dataInfo, userInfo, message);
                    break;
                //...receive from discussion service...//
                case    comment.COMMENT_IN_POST:
                case    comment.REPLY_IN_POST:
                    await notifyRepository.commentChanged(dataInfo, {...userInfo, type: notifyEvent.split('_')[0]}, message);
                    break;
                //...receive from shopping service...//
                case    order.PAY_FAILURE:
                case    order.PAY_SUCCESS:
                    await notifyRepository.orderChanged(dataInfo, {...userInfo, type: notifyEvent.split('_')[1]}, message);
                    break;
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = eventService;