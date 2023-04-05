const {Notify} = require('./../model');
const {notify} = require('./../../constant');
const uniqid = require('uniqid');

const notifyRepository = {
    createAccount: async(userInfo)=>{
        const {
            _id,
            name,
            image
        } = userInfo;
        try {
            const notify = new Notify({
                user: {
                    _id,
                    name,
                    image
                }
            })
            await notify.save();
        } catch(err) {
            throw err;
        }
    },
    updateProfile: async(userInfo)=>{
        const {
            _id,
            name,
            image
        } = userInfo;
        try {
            await Notify.updateOne({'user._id': _id}, {
                $set: {
                    user: {
                        _id: _id,
                        name: name,
                        image: image,
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    },
    assistantStateChanged: async(dataInfo, userInfo, message)=>{
        const {
            course
        } = dataInfo;
        const {
            _id: userId,
            state
        } = userInfo;
        try {
            const {_id: courseId} = course;
            const notifyRaw = notify.censor.assistant[state.toLowerCase()];
            const notifyData = {
                notificationId: uniqid(),
                title: notifyRaw.title,
                type: notifyRaw.type,
                redirect: `${notifyRaw.redirect}/get-recruit?courseId=${courseId}`,
                message
            }
            await Notify.updateOne({'user._id': userId}, {
                $push: {
                    notification: notifyData
                }
            });

        } catch(err) {
            throw err;
        }
    },
    courseStateChanged: async(dataInfo, userInfo, message)=>{
        const {
            course
        } = dataInfo;
        const {
            _id: userId,
        } = userInfo;
        try {
            const {_id: courseId, state} = course;
            const notifyRaw = notify.censor.course[state.toLowerCase()];
            const notifyData = {
                notificationId: uniqid(),
                title: notifyRaw.title,
                type: notifyRaw.type,
                redirect: `${notifyRaw.redirect}/:${courseId}`,
                message,
            }
            await Notify.updateOne({'user._id': userId}, {
                $push: {
                    notification: notifyData
                }
            });
        } catch(err) {
            throw err;
        }
    },
    lessonChanged: async(dataInfo, userInfo, message)=>{
        const {
            lesson,
            course
        } = dataInfo;
        try {
            const {kind, _id: lessonId} = lesson;
            const {_id: courseId} = course;
            const ids = userInfo.map((user)=>user._id);

            const notifyRaw = notify.course.lesson[kind.toLowerCase()];
            const notifyData = {
                notificationId: uniqid(),
                title: notifyRaw.title,
                type: notifyRaw.type,
                redirect: `${notifyRaw.redirect}/:${courseId}?${lessonId}`,
                message
            }
            await Notify.updateMany({'user._id': {
                $in: ids
            }}, {
                $push: {
                    notification: notifyData
                }
            });
        } catch(err) {
            throw err;
        }
    },
    expireChanged: async(dataInfo, userInfo, message)=>{
        const {
            course
        } = dataInfo;
        const {
            _id: userId,
            type
        } = userInfo;
        try {
            const {_id: courseId} = course;
            const notifyRaw = notify.expire[type.toLowerCase()];
            const notifyData = {
                notificationId: uniqid(),
                title: notifyRaw.title,
                type: notifyRaw.type,
                redirect: `${notifyRaw.redirect}/:${courseId}`,
                message
            }
            await Notify.updateOne({'user._id': userId}, {
                $push: {
                    notification: notifyData
                }
            });
        } catch(err) {
            throw err;
        }
    },
    rankChanged: async(dataInfo, userInfo, message)=>{
        const {
            course,
            lesson
        } = dataInfo;
        const {
            _id: userId,
        } = userInfo;
        try {
            const {_id: courseId} = course;
            const {_id: lessonId} = lesson;
            const notifyRaw = notify.rank;
            const notifyData = {
                notificationId: uniqid(),
                title: notifyRaw.title,
                type: notifyRaw.type,
                redirect: `${notifyRaw.redirect}/:${courseId}/:${lessonId}`,
                message
            }
            await Notify.updateOne({'user._id': userId}, {
                $push: {
                    notification: notifyData
                }
            });
        } catch(err) {
            throw err;
        }
    },
    commentChanged: async(dataInfo, userInfo, message)=>{
        const {
            post,
            discussion
        } = dataInfo;
        const {
            _id: userId,
            type
        } = userInfo;
        try {
            const {_id: postId} = post;
            const notifyRaw = notify.comment[type.toLowerCase()];
            const notifyData = {
                notificationId: uniqid(),
                title: notifyRaw.title,
                type: {
                    name: notifyRaw.type.name,
                    image: discussion.user.image
                },
                redirect: `${notifyRaw.redirect}/:${postId}?commentId=${discussion.comment._id}`,
                message
            }
            await Notify.updateOne({'user._id': userId}, {
                $push: {
                    notification: notifyData
                }
            });
        } catch(err) {
            throw err;
        }
    },
    orderChanged: async(dataInfo, userInfo, message)=>{
        const {
            order
        } = dataInfo;
        const {
            _id: userId,
            type
        } = userInfo;
        try {
            const {_id: orderId} = order;
            const notifyRaw = notify.order[type.toLowerCase()];
            const notifyData = {
                notificationId: uniqid(),
                title: notifyRaw.title,
                type: notifyRaw.type,
                redirect: `${notifyRaw.redirect}/:${orderId}`,
                message
            }
            await Notify.updateOne({'user._id': userId}, {
                $push: {
                    notification: notifyData
                }
            });
        } catch(err) {
            throw err;
        }
    },
    updateAllNewsNotification: async(userId)=>{
        try {
            await Notify.updateOne({'user._id': userId}, {
                $set: {
                    'notification.$[].new': false,
                }
            })
        } catch(err) {
            throw err;
        }
    },
    getAllNotifications: async(userId)=>{
        try {
            const notify = await Notify.findOne({'user._id': userId});
            if(!notify) throw new Error('user is not found!');

            return notify._doc || notify;
        } catch(err) {
            throw err;
        }
    },
    deleteNotification: async(userId, notificationId)=>{
        try {
            await Notify.deleteOne({'user._id': userId}, {
                $pull: {
                    notification: {
                        _id: notificationId
                    }
                }
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = notifyRepository;