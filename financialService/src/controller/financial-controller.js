const {financialService} = require('./../service');
const {status, event, queue} = require('./../constant');


class FinancialController {
    constructor(conn) {
        this.conn = conn;
    }

    rechargeBudget = async(req, res)=>{
        try {
            const {money} = req.body;

            const {financial} = await financialService.rechargeBudget(money, req.user);

            //send data to subscriber
            const channel = await this.conn.createChannel();

            //send data to QUEUE
            await channel.assertQueue(queue.BUDGET_CHANGED);
            await channel.sendToQueue(queue.BUDGET_CHANGED, Buffer.from(JSON.stringify({
                finance: financial,
                status: financial ? 'SUCCESS' : 'FAILURE',
                event: event.budget.RECHARGE_BUDGET
            })));
            
            res.status(status.OK).json(financial);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = FinancialController;