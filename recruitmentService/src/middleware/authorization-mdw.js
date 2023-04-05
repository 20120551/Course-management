const { ValidateSignature } = require('./../utils');
const { status } = require('../constant');
const {recruitRepository} = require('./../database');

const authorizationMdw = {
    checkUser: (req, res, next)=>{
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
        try {
            const {_id} = req.user;
            const {courseId} = req.query;
            const recruit = await recruitRepository.getRecruit(courseId);

            if(!recruit)  return res.status(status.UN_AUTHENTICATE).json('not found recruitment!');

            const {course} = recruit;
            if(course.teacher._id !== _id)  
                return res.status(status.UN_AUTHENTICATE).json('you are not permission!');

            next();
        } catch(err) {
            res.status(status.UN_AUTHORIZED).json(err);
        }
    },
    validTimeApply: async(req, res, next)=>{
        try {
            const {courseId} = req.query;
            const recruit = await recruitRepository.getRecruit(courseId);
            const { 
                startRecruit,
                endRecruit
            } = recruit;
            const now = new Date();
            if(now < startRecruit || now > endRecruit)  
                return res.status(status.UN_AUTHENTICATE).json('valid time apply for that position!');
            next();
        } catch(err) {
            res.status(status.UN_AUTHORIZED).json(err);
        }
    },
    checkPermission: async(req, res, next)=>{
        try {
            const isAuthentication = ValidateSignature(req);
    
            if(!isAuthentication) 
                return res.status(status.UN_AUTHENTICATE).json("your token is valid!");
    
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