const {
    DefaultState,
    PendingState,
    SuccessState,
    FailureState
} = require('./state');

class PaymentMachine {
    constructor(conn){
        this.defaultState = new DefaultState(this, conn);
        this.pendingState = new PendingState(this, conn);
        this.successState = new SuccessState(this, conn);
        this.failureState = new FailureState(this, conn);

        this.currentState = this.defaultState;
    }

    doPaymentStep = async(payload)=>{
        try {
            await this.currentState.payment(payload);
            console.log('state: ', this.currentState.constructor.name);
        } catch(err) {
            throw err;
        }
    }

    setState = (state)=>{
        this.currentState = state;
    }
}

module.exports = PaymentMachine;