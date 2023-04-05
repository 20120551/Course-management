const { wishlist } = require('../../constant/event-constant');
const {User} = require('./../model');

const userRepository = {
    createUser: async({username, password, roles, kind, userType})=> {
        try {
            //generate user
            const user = new User({
                username: username,
                password: password,
                roleIds: roles,
                kind: kind,
                userType: userType
            });

            //save user in database 
            const result = await user.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    activeAccountById:  async(_id)=>{
        try {
            const user = await User.findOneAndUpdate({_id: _id}, {$set: {isActive: true}});
            if(!user) throw new Error('user does not exists!');
            return user.kind;
        }catch(err) {
            throw err;
        }
    },
    findByUsername: async(username)=> {
        try {
            const user = await User.findOne({username: username}).populate('userType');
            return user;
        }
        catch(err) {
            throw err;
        }
    },
    findById: async(_id)=> {
        try {
            const user = await User.findOne({_id: _id});

            if(!user) throw new Error('user does not exists!');
            return user._doc || user;
        }
        catch(err) {
            throw err;
        }
    },
    updatePasswordById: async(_id, value)=>{
        try {
            await User.updateOne({_id: _id}, {$set: {password: value}});
        } catch(err) {
            throw err;
        }
    },
    getInformationById: async(_id)=>{
        try {
            const user = await User.findOne({_id: _id}).populate('userType');
            if(!user) throw new Error('user does not exists!');
            return user._doc || user;
        }catch(err) {
            throw err;
        }
    },
    updateInformationById: async({
        _id,
        name, 
        birthDay, 
        facebook, 
        sex, 
        phoneNumber, 
        teaching, 
        description,
        degree, 
        addressId
    })=>{
        try {
            const data = await User.findOne({_id: _id}).populate('roleIds').populate('userType');
            if(!data) throw new Error('user does not exist!');

            //update info of customer
            data.userType.name = name;
            data.userType.birthDay = birthDay;
            data.userType.facebook = facebook;
            data.userType.sex = sex;
            data.userType.phoneNumber = phoneNumber;
            data.userType.teaching = teaching;
            data.userType.degree = degree;
            data.userType.description = description;
            data.userType.addressId = addressId;

            await data.userType.save()
            return data._doc || data;
        } catch(err) {
            throw err;
        }
    },
    createCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id: courseId,
            ...data
        } = courseInfo;

        const {
            _id,
        } = teacherInfo;
        try {
            const educator = await User.findById({_id: _id}).populate('userType');
            if(!educator) throw new Error('user does not exist!');

            const {courses} = educator.userType;
            if(!courses) throw new Error('courses does not exist!');

            courses.push({
                _id: courseId,
                ...data
            });

            await educator.userType.save();
        } catch(err) {
            throw err;
        }
    },
    updateCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id: courseId,
            name: courseName,
            background,
            subject,
            expires,
            description: courseDes,
            price,
            theme,
            state,
            deleted
        } = courseInfo;

        const {
            _id,
        } = teacherInfo;
        try {
            const educator = await User.findById({_id: _id}).populate('userType');
            if(!educator) throw new Error('educator does not exist!');

            const {courses} = educator.userType;
            if(!courses) throw new Error('courses does not exist!');


            //update course
            courses.forEach((course)=>{
                if(course._id === courseId) {
                    course.name = courseName;
                    course.background = background;
                    course.subject = subject;
                    course.expires = expires;
                    course.description = courseDes;
                    course.price = price;
                    course.theme = {
                        _id: theme._id,
                        name: theme.name
                    };
                    course.state = state;
                    course.deleted = deleted;
                    return;
                }
            })

            await educator.userType.save();      
        } catch(err) {
            throw err;
        }
    },
    destroyCourse: async(courseInfo, teacherInfo)=>{
        const {
            _id: courseId,
            ...data
        } = courseInfo;

        const {
            _id,
        } = teacherInfo;
        try {
            const educator = await User.findById({_id: _id}).populate('userType');
            if(!educator) throw new Error('educator does not exist!');

            const {courses} = educator.userType;
            if(!courses) throw new Error('courses does not exist!');

            courses.forEach((course, index)=>{
                if(course._id === courseId) {
                    return courses.splice(index, 1);
                }
            })

            await educator.userType.save(); 
        } catch(err) {
            throw err;
        }
    },
    addToWishlist: async(courseInfo, userInfo)=>{
        const {_id} = userInfo;
        const {
            _id: courseId,
            name,
            background,
            subject,
            grade,
            description,
            theme,
            price
        } = courseInfo;
        try {  
            const user = await User.findById({_id: _id}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {wishList} = user.userType;
            if(!wishlist) throw new Error('wishlist does not exist!');

            wishList.push({
                _id: courseId,
                name,
                background,
                subject,
                grade,
                description,
                price,
                theme: {
                    _id: theme._id,
                    name: theme.name,
                }
            })

            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    removeToWishlist: async(courseInfo, userInfo)=>{
        const {_id: userId} = userInfo;
        const {_id: courseId} = courseInfo;

        try {
            const user = await User.findById({_id: userId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {wishList} = user.userType;
            if(!wishlist) throw new Error('wishlist does not exist!');

            wishList.forEach((course, index)=>{
                if(course._id === courseId) {
                    return wishList.splice(index, 1);
                }
            })

            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    getWishlistCourses: async(_id)=> {
        try {
            const user = await User.findById({_id: _id}).populate('userType');
            if(!user) throw new Error('user does not exist!');
            
            return user.userType.wishList;
        } 
        catch(err) {
            throw err;
        }
    },
    addToCart: async(courseInfo, userInfo)=>{
        const {_id} = userInfo;
        const {
            _id: courseId,
            name,
            background,
            subject,
            grade,
            theme,
            price
        } = courseInfo;
        try {  
            const user = await User.findById({_id: _id}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {cart} = user.userType;
            if(!cart) throw new Error('cart does not exist!');

            cart.push({
                _id: courseId,
                name,
                background,
                subject,
                grade,
                price,
                theme: {
                    _id: theme._id,
                    name: theme.name,
                }
            })

            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    removeToCart: async(courseInfo, userInfo)=>{
        const {_id: userId} = userInfo;
        const {_id: courseId} = courseInfo;

        try {
            const user = await User.findById({_id: userId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {cart} = user.userType;
            if(!cart) throw new Error('cart does not exist!');
            
            cart.forEach((course, index)=>{
                if(course._id === courseId) {
                    return cart.splice(index, 1);
                }
            })

            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    removeAllCart: async(courseInfo, userInfo)=>{
        const {_id: userId} = userInfo;
        try {
            const user = await User.findById({_id: userId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {cart} = user.userType
            if(!cart) throw new Error('cart does not exist!');
            
            cart.splice(0, cart.length);
            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },

    addToOrder: async(userInfo, orderInfo)=>{
        const {_id} = userInfo;
        const {
            _id: orderId,
            status,
            items
        } = orderInfo;
        try {  
            const user = await User.findById({_id: _id}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {order} = user.userType;
            if(!order) throw new Error('order does not exist!');

            order.push({
                _id: orderId,
                status,
                items
            })

            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    updateInOrder: async(userInfo, orderInfo)=>{
        const {_id} = userInfo;
        const {
            _id: orderId,
            status
        } = orderInfo;
        try {
            const user = await User.findById({_id: _id}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {order} = user.userType;
            if(!order) throw new Error('order does not exist!');

            order.forEach((or)=>{
                if(or._id === orderId) {
                    return or.status = status;
                }
            })

            await user.userType.save();
        } catch(err){
            throw err;
        }
    },
    removeFromOrder: async(userInfo, orderInfo)=>{
        const {_id: userId} = userInfo;
        const {_id: orderId} = orderInfo;

        try {
            const user = await User.findById({_id: userId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {order} = user.userType;
            if(!order) throw new Error('order does not exist!');

            order.forEach((or, index)=>{
                if(or._id === orderId) {
                    return order.splice(index, 1);
                }
            })

            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    getCartCourses: async(_id)=> {
        try {
            const user = await User.findById({_id: _id}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            return user.userType.cart;
        } 
        catch(err) {
            throw err;
        }
    },
    getOrderCourses: async(_id)=> {
        try {
            const user = await User.findById({_id: _id}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            return user.userType.order;
        } 
        catch(err) {
            throw err;
        }
    },
    UpdateTransferHistory: async(historyInfo, state)=>{
        const {
            _id,
            money,
            userId,
            transfer
        } = historyInfo;
        try {

            const user = await User.findOne({_id: userId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const budget = user.userType.budget;
            if(!budget) throw new Error('budget does not exist!');

            const {transferHistory} = budget;

            //save data;
            budget._id = _id;
            budget.money = money;
            transferHistory.push({
                _id: transfer._id,
                transferMoney: transfer.money,
                purpose: transfer.purpose,
                idSour: transfer.source._id,
                idDes: transfer.destination._id,
                state
            })
            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    UpdateRechargeHistory: async(historyInfo, state)=>{
        const {
            _id,
            money,
            userId,
            transfer
        } = historyInfo;
        try {

            const user = await User.findOne({_id: userId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const budget = user.userType.budget;
            if(!budget) throw new Error('budget does not exist!');

            const {rechargeHistory} = budget;

            //save data;
            budget._id = _id;
            budget.money = money;
            rechargeHistory.push({
                _id: transfer._id,
                rechargeMoney: transfer.money,
                idDes: transfer.destination._id,
                state
            })

            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    addCourseToProgress: async(userInfo, courseInfo)=>{
        const {_id: userId} = userInfo;
        try {
            const user = await User.findById({_id: userId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            courseInfo.forEach(async(course)=>{
                const {
                    _id,
                    name,
                    background,
                    subject,
                    description,
                    theme,
                    startRolling,
                    endCourse
                } = course;

                user.userType.courses.push({
                    _id,
                    name,
                    background,
                    subject,
                    description,
                    theme: {
                        _id: theme._id,
                        name: theme.name
                    },
                    startRolling,
                    endCourse
                })

            })
            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    deleteCourseFromProgress: async(userId, courseId)=>{
        try {
            const user = await User.findOne({_id: userId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {courses} = user.userType;
            if(!courses) throw new Error('courses does not exist!');

            courses.forEach((course, index)=>{
                if(course._id === courseId) {
                    return courses.splice(index, 1)
                }
            });
            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    addCourseToAssistant: async(assistantId, courseInfo)=>{
        const {
            _id,
            name, 
            background,
            subject,
            grade,
            deleted,
            theme
        } = courseInfo;
        try {
            const user = await User.findById({_id: assistantId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {assistanceCourse} = user.userType;
            if(!assistanceCourse) throw new Error('assistant does not exist!');

            assistanceCourse.push({
                _id,
                name, 
                background,
                subject,
                grade,
                deleted,
                theme: {
                    _id: theme._id,
                    name: theme.name
                }
            });

            await user.userType.save();
        } catch(err) {
            throw err;
        }
    },
    expireAssistantContract: async(assistantId, courseInfo)=>{
        const {
            _id
        } = courseInfo;
        try {
            const user = await User.findById({_id: assistantId}).populate('userType');
            if(!user) throw new Error('user does not exist!');

            const {assistanceCourse} = user.userType;
            assistanceCourse.forEach((course, index)=>{
                if(_id === course._id) {
                    return assistanceCourse.splice(index, 1);
                }
            })
            await user.userType.save();
        } catch(err) {
            throw err;
        }
    }
}

module.exports = userRepository;