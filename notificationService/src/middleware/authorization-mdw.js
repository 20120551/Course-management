const { ValidateSignature } = require('./../utils');
const {notifyRepository} = require('./../database');
const { status } = require('../constant');

const authorizationMdw = {
    checkUser: async(req, res, next)=>{
        //decode token store in req.user
        try {
            const isAuthentication = ValidateSignature(req);
    
            if(!isAuthentication) return res.status(status.UN_AUTHENTICATE).json("your token is valid!");
    
            next();
        } catch(err) {
            res.status(status.UN_AUTHORIZED).json(err);
        }

    },
    checkAuthor: async(req, res, next)=>{
        //decode token store in req.user
        try {
            const {notificationId} = req.params;
            const {_id} = req.user;
            const notify = await notifyRepository.getAllNotifications(_id);

            const {notification} = notify;
            if(!notification.some((notify)=>notify._id === notificationId)) 
                throw new Error('you are not permission!');
            next();
        } catch(err) {
            res.status(status.UN_AUTHORIZED).json(err);
        }

    },
    checkPermission: async(req, res, next)=>{
        try {
            const isAuthentication = ValidateSignature(req);
    
            if(!isAuthentication) return res.status(status.UN_AUTHENTICATE).json("your token is valid!");
    
            const { listOfPermissions } = req.user;

            if(!listOfPermissions.some((e)=>{
                //handle pre-process
                let url = e.code;
                if(req.params) {
                    const params = req.params;
                    const keys = Object.keys(params);
                    const values = Object.values(params);
                    
                    keys.forEach((key, index)=>{
                        url = url.replace(`:${key}`, values[index]);
                    })
                }
                if(req.query) {
                    let symbol = '?';
                    const query = req.query;
                    const keys = Object.keys(query);
                    const values = Object.values(query);
                    keys.forEach((key, index)=> {
                        url = url.concat(symbol, key, '=', values[index]);
                        symbol = '&';
                    })
                }
                return req.url === url;
            })) {
                return res.status(status.UN_AUTHORIZED).json("you're not permission!");
            }
            next();
        } catch(error) {
            res.status(status.UN_AUTHORIZED).json(error);
        }
    }
}

module.exports = authorizationMdw;