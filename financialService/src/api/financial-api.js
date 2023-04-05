const {authorizationMDW} = require('./../middleware');
const {FinancialController} = require('./../controller');

function financialApi(app, conn) {
    const financialController = new FinancialController(conn);

    app.post(
        '/payment/recharge',
        authorizationMDW.checkUser,
        financialController.rechargeBudget
    )
}

module.exports = financialApi;