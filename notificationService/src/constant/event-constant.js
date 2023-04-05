const user = {
    ASSISTANCE_UPDATED: 'ASSISTANCE_UPDATED',
    TEACHER_UPDATED:  'TEACHER_UPDATED',
    STUDENT_UPDATED: 'STUDENT_UPDATED',
    ADMIN_UPDATED: 'ADMIN_UPDATED',
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
}

const notify = {
    censor: {
        COURSE_APPROVE: 'COURSE_APPROVE',
        COURSE_REJECT: 'COURSE_REJECT',
        ASSISTANT_INTERVIEWING: 'ASSISTANT_INTERVIEWING',
        ASSISTANT_REJECT: 'ASSISTANT_REJECT',
        ASSISTANT_APPROVE: 'ASSISTANT_APPROVE'
    },
    course: {
        CREATE_LECTURE: 'CREATE_LECTURE',
        CREATE_EXERCISE: 'CREATE_EXERCISE'
    },
    expire: {
        EXPIRE_ASSISTANT: 'EXPIRE_ASSISTANT',
        EXPIRE_STUDENT: 'EXPIRE_STUDENT',
    },
    rank: {
        SCORED_COMPLETELY: 'SCORED_COMPLETELY'
    },
    comment: {
        COMMENT_IN_POST: 'COMMENT_IN_POST',
        REPLY_IN_POST: 'REPLY_IN_POST',
    },
    order: {
        PAY_SUCCESS: 'PAY_SUCCESS',
        PAY_FAILURE: 'PAY_FAILURE',
    }
}

module.exports = {
    user,
    notify
}