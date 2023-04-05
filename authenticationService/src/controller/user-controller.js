const {userService} = require('../service')
const {status, queue, event} = require('../constant');

class CustomerController {
    constructor(conn) {
        this.conn = conn;
    }
    async otpActivateAccount(req, res){
        //after sign up -> redirect to login -> redirect to active email 
        try {
            const {username, _id} = req.user;
            //verify your account
            const {secretKeyToken} = await userService.otpActivateAccount({username, _id});
            
            //store in cookie
            //active cookie
            res.cookie('activeKey', secretKeyToken, {
                secure: false,
                httpOnly: true,
                sameSite: "strict",
            });

            res.status(status.OK).json(`key to active ${secretKeyToken}`);
        } catch(err) {
            res.status(status.BAD_REQUEST).json(err.message);
        }
    }
    activateAccount = async(req, res)=>{
        try {
            const { key } = req.body;
            const activeKey = req.cookies.activeKey;

            //verify key
            const {kind} = await userService.activateAccount(key, activeKey);
            //clean cookie
            res.clearCookie("activeKey");

            //send to queue to create progress and financial
            const channel = await this.conn.createChannel();

            //publish for [FINANCIAL, PROGRESS]
            await channel.assertExchange(queue.ACCOUNT_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.ACCOUNT_CHANGED, '', Buffer.from(JSON.stringify({
                userInfo: req.user,
                kind,
                event: event.user.CREATE_ACCOUNT
            })));

            //respond
            res.status(status.OK).json("active account successfully");
        }catch(err) {
            res.status(status.BAD_REQUEST).json(err.message);
        }
    }
    async requestRefreshToken(req, res){
        try {
            const token = req.cookies.refreshToken;
    
            //get token back
            const {payload, accessToken, refreshToken} = await userService.requestRefreshToken(token);
    
            //store token in cookies
            res.cookie('refreshToken', refreshToken, {
                secure: false,
                httpOnly: true,
                sameSite: "strict",
            });
    
            //send back to user
            res.status(status.OK).json({...payload, accessToken});
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }

    }
    async createAccount(req, res) {
        try {
            const {
                username, 
                password, 
                roles, 
                name,
                workPlace, 
                degree,
                sex,
                teaching,
            } = req.body
            
            const {user, account} = await userService.createAccount({
                username, 
                password, 
                roles, 
                name,
                workPlace, 
                degree,
                sex,
                teaching,
            });
            res.status(status.OK).json("create account successfully!");
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    async viewProfile(req, res) {
        try {
            const {_id} = req.user;
            const {userType} = await userService.viewProfile(_id);
            res.status(status.OK).json(userType);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    updateProfile = async(req, res)=> {
        try {
            const {_id} = req.user;

            const {user} = await userService.updateProfile({
                _id,
                ...req.body
            });

            const {roleIds, userType} = user;

            const data = {
                name: userType.name,
                description: userType.description,
                image: userType.image,
                username: user.username,
                _id
            }

           
            //send updated profile for subscriber
            roleIds.forEach(async(role)=>{
                const key = `${role.roleName}_UPDATED`;
                 //send to queue to create progress and financial
                const channel = await this.conn.createChannel();

                //publish for [FINANCIAL, PROGRESS]
                await channel.assertExchange(queue.ACCOUNT_CHANGED, 'fanout', { durable: false });
                await channel.publish(queue.ACCOUNT_CHANGED, '', Buffer.from(JSON.stringify({
                    userInfo: data,
                    kind: user.kind,
                    event: event.user[key]
                })));
            })

            res.status(status.OK).json("update successfully!");
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    async getWishlistCourses(req, res) {
        try {
            const {_id} = req.user;
            const {wishlist} = await userService.getWishlistCourses(_id);

            res.status(status.OK).json(wishlist);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    async getCartCourses(req, res) {
        try {
            const {_id} = req.user;
            const {carts} = await userService.getCartCourses(_id);

            res.status(status.OK).json(carts);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    async getOrderCourses(req, res) {
        try {
            const {_id} = req.user;
            const {order} = await userService.getCartCourses(_id);

            res.status(status.OK).json(order);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    async otpExchangePassword(req, res) {
        try {
            const {confirmPassword, newPassword} = req.body;
            const {_id, username} = req.user;
            const {secretKeyToken} = await userService.otpExchangePassword({_id, username, confirmPassword, newPassword});

            //set cookie
            res.cookie('secretKey', secretKeyToken, {
                secure: false,
                httpOnly: true,
                sameSite: "strict",
            });

            res.status(status.OK).json(secretKeyToken);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    async exchangePassword(req, res) {
        try {
            const {key} = req.body;
            const token = req.cookies.secretKey;
            const {_id} = req.user;

            await userService.exchangePassword({_id, token, key});
            res.status(status.OK).json("change password successfully!");
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    async logout(req, res){
        try {
            const token = req.cookies.refreshToken;
            //delete token in db
            await userService.logout(token);

            //clean cookie
            res.clearCookie('refreshToken');
            res.status(status.OK).json("logout successfully!");
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = CustomerController;
