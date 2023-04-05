
const cart = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_TO_CART: 'REMOVE_TO_CART',
    REMOVE_ALL_CART: 'REMOVE_ALL_CART'
}

const order = {
    ADD_TO_ORDER: 'CREATE_ORDER',
    UPDATE_IN_ORDER: 'UPDATE_IN_ORDER',
    REMOVE_FROM_ORDER: 'REMOVE_FROM_ORDER',
}

const user = {
    ASSISTANCE_UPDATED: 'ASSISTANCE_UPDATED',
    TEACHER_UPDATED:  'TEACHER_UPDATED',
    STUDENT_UPDATED: 'STUDENT_UPDATED',
    ADMIN_UPDATED: 'ADMIN_UPDATED',
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
}

const notify = {
    order: {
        PAY_SUCCESS: 'PAY_SUCCESS',
        PAY_FAILURE: 'PAY_FAILURE',
    }
}

module.exports = {
    cart,
    order,
    user,
    notify
}