const {CartController} = require('./../controller');
const {authorizationMDW} = require('./../middleware');

function cartApi(app, conn) {
    const cartController = new CartController(conn);

    app.get(
        '/cart',
        authorizationMDW.checkUser,
        cartController.getAllCarts,
    );

    app.post(
        '/cart/create-order',
        authorizationMDW.checkUser,
        cartController.createOrder,
    );

    app.get(
        '/order',
        authorizationMDW.checkUser,
        cartController.getAllOrders,
    );

    app.get(
        '/order/:orderId',
        authorizationMDW.checkUser,
        cartController.getParticularOrder,
    );
    
}

module.exports = cartApi;