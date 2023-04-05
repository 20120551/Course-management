const course = {
    CREATE_COURSE: 'CREATE_COURSE',
    UPDATE_COURSE:  'UPDATE_COURSE',
    DELETE_COURSE: 'DELETE_COURSE',
    DESTROY_COURSE: 'DESTROY_COURSE',
    RESTORE_COURSE: 'RESTORE_COURSE'
}

const user = {
    ASSISTANCE_UPDATED: 'ASSISTANCE_UPDATED',
    TEACHER_UPDATED:  'TEACHER_UPDATED',
    STUDENT_UPDATED: 'STUDENT_UPDATED',
    ADMIN_UPDATED: 'ADMIN_UPDATED',
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
}

const wishlist = {
    ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
    REMOVE_TO_WISHLIST: 'REMOVE_TO_WISHLIST',
}

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

const budget = {
    TRANSFER_BUDGET: 'TRANSFER_BUDGET',
    RECHARGE_BUDGET: 'RECHARGE_BUDGET'
}

const progress = {
    ADD_COURSE_TO_PROGRESS: 'ADD_COURSE_TO_PROGRESS',
    EXPIRE_COURSE_IN_PROGRESS: 'EXPIRE_COURSE_IN_PROGRESS'
}

const assistant = {
    ADD_ASSISTANT_TO_SERVICE: 'ADD_ASSISTANT_TO_SERVICE',
    EXPIRE_ASSISTANT_CONTRACT: 'EXPIRE_ASSISTANT_CONTRACT'
}

module.exports = {
    course,
    user,
    wishlist,
    cart,
    order,
    budget,
    progress,
    assistant
}