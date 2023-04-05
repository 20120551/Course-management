const censor = {
    assistant: {
        approve: {
            title: 'chúc mừng bạn đã được phê duyệt vào khóa học',
            type: {
                name: 'censor-approve',
                image: 'censor.png'
            },
            redirect: '/recruit'
        },
        interviewing: {
            title: 'bạn đã lọt vào vòng phỏng vấn, vui lòng kiểm tra mail',
            type: {
                name: 'censor-interviewing',
                image: 'censor.png'
            },
            redirect: '/recruit'
        },
        reject: {
            title: 'rất tiếc, bạn đã bị từ chối trong buổi tuyển dụng',
            type: {
                name: 'censor-reject',
                image: 'censor.png'
            },
            redirect: '/recruit'
        }
    },
    course: {
        update: {
            title: 'Khóa học của bạn đã được phê duyệt',
            type: {
                name: 'censor-approve',
                image: 'censor.png'
            },
            redirect: '/course'
        },
        delete: {
            title: 'khóa học vi phạm 1 số vi chuẩn, vui lòng kiểm tra lại',
            type: {
                name: 'censor-reject',
                image: 'censor.png'
            },
            redirect: '/course'
        }
    }
}

const course = {
    lesson: {
        lecture: {
            title: 'một bài giảng mới vừa được thêm, hãy vào học nhé',
            type: {
                name: 'lecture',
                image: 'lecture.png',
            },
            redirect: '/course'
        },
        exercise: {
            title: 'bạn có một bài tập mới cần hoàn thành',
            type: {
                name: 'exercise',
                image: 'exercise.png',
            },
            redirect: '/course'
        }
    }
}

const expire = {
    assistant: {
        title: 'bạn đã hết hợp đồng trợ lý với lớp học',
        type: {
            name: 'expire',
            image: 'expire.png',
        },
        redirect: '/course'
    },
    student: {
        title: 'bạn đã hết thời gian học tập ở khóa học',
        type: {
            name: 'expire',
            image: 'expire.png',
        },
        redirect: '/order'
    }
}

const comment = {
    comment: {
        title: 'đã bình luận vào bài viết của bạn',
        type: {
            name: 'comment',
            image: 'comment.png',
        },
        redirect: '/discussion'
    },
    reply: {
        title: 'đã trả lời bình luận của bạn',
        type: {
            name: 'reply',
            image: 'reply.png',
        },
        redirect: '/discussion'
    }
}

const order = {
    success: {
        title: 'bạn đã thực hiện thanh toán thành công',
        type: {
            name: 'success-paying',
            image: 'success-paying.png',
        },
        redirect: '/order'
    },
    failure: {
        title: 'bạn đã thực hiện thanh toán không thành công, vui lòng kiểm tra lại',
        type: {
            name: 'failure-paying',
            image: 'failure-paying.png',
        },
        redirect: '/order'
    }
}

const rank = {
    title: 'đã có xếp hạng điểm của bài kiểm tra',
    type: {
        name: 'rank',
        image: 'rank.png',
    },
    redirect: '/progress'
}

module.exports = {
    censor,
    course,
    expire,
    rank,
    comment,
    order
}