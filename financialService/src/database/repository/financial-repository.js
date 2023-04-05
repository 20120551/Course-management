const {Financial} = require('./../model');
const {startSession} = require('mongoose');
const rechargeRepository = require('./../repository/recharge-repository');
const transferRepository = require('./../repository/transfer-repository');

const financialRepository = {
    createFinancial: async(userInfo)=>{
        const {
            _id,
            name
        } = userInfo;
        try {
            const financial = new Financial({
                money: 0,
                user: {
                    _id,
                    name
                }
            });

            const result = await financial.save();
            return result._doc || result;
        } catch(err) {
            throw err;
        }
    },
    updateFinancialAccount: async(userInfo)=>{
        const {
            _id,
            name
        } = userInfo;
        try {
            await Financial.updateOne({'user._id': _id}, {
                $set: {'user.name': name}
            });
        } catch(err) {
            throw err;
        }
    },
    rechargeBudget: async(money, userInfo)=>{
        const {
            _id,
            name
        } = userInfo;
        const session = await startSession();
        try {
            //start transaction
            session.startTransaction();
            const financial = await Financial.findOneAndUpdate({'user._id': _id}, {
                $inc: {
                    money: +money
                }
            }, {session, new: true});

            if(!financial) throw new Error('user does not exist!');

            const recharge = await rechargeRepository.createRecharge({
                money,
                destination: {
                    _id,
                    name
                },
                status: 'res'
            })
            financial.rechargeHistory.push(recharge._id);

            await financial.save();

            //commit and end transaction
            await session.commitTransaction();
            await session.endSession();
            return {
                _id: financial._id,
                money: financial.money,
                userId: financial.user._id,
                transfer: recharge
            };
        } catch(err) {
            await session.abortTransaction();
            await session.endSession();
            throw err;
        }
    },
    transferBudget: async(sourceInfo, desInfo)=>{
        const {
            _id,
            name: studentName
        } = sourceInfo;
        const session = await startSession();
        try {
            //start transaction
            session.startTransaction();
            const result = await Promise.all(desInfo.map(async(course)=>{
                const {
                    price,
                    name,
                    teacher
                } = course;

                const {
                    _id: teacherId,
                    name: teacherName
                } = teacher;

                //update source finance
                const sourceFinance = await Financial.findOneAndUpdate({'user._id': _id}, {
                    $inc: {
                        money: -price
                    }
                }, {session, new: true});

                if(!sourceFinance) throw new Error('user does not exist!');

                //update des finance
                const desFinance = await Financial.findOneAndUpdate({'user._id': teacherId}, {
                    $inc: {
                        money: +price
                    }
                }, {session, new: true})

                if(!desFinance) throw new Error('user does not exist!');

                const sourceTransfer = await transferRepository.createTransfer({
                    money: price,
                    status: 'res',
                    purpose: `Pay for ${name} course`,
                    source: {
                        _id,
                        studentName
                    },
                    destination: {
                        _id: teacherId,
                        name: teacherName
                    }
                });

                //save in user history
                sourceFinance.transferHistory.push(sourceTransfer._id);

                const desTransfer = await transferRepository.createTransfer({
                    money: price,
                    status: 'res',
                    purpose: `Be paid for ${name} course`,
                    source: {
                        _id,
                        studentName
                    },
                    destination: {
                        _id: teacherId,
                        name: teacherName
                    }
                })

                //save in teacher history
                desFinance.transferHistory.push(desTransfer._id);

                await sourceFinance.save();
                await desFinance.save();

                return {
                    sourceFinance: {
                        _id: sourceFinance._id,
                        money: sourceFinance.money,
                        userId: sourceFinance.user._id,
                        transfer: sourceTransfer
                    },
                    desFinance: {
                        _id: desFinance._id,
                        money: desFinance.money,
                        userId: desFinance.user._id,
                        transfer: desTransfer
                    }
                }
            }))
            //commit and end transaction
            await session.commitTransaction();
            await session.endSession();
            return result;
        } catch(err) {
            await session.abortTransaction();
            await session.endSession();
            throw err;
        }
    }
}

module.exports = financialRepository;