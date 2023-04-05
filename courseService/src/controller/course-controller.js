const {status, queue, event} = require('./../constant');
const {courseService} = require('./../service');

class CourseController {
    constructor(conn) {
        this.conn = conn;
    }

    createCourse = async(req, res)=> {
        try {
            const {course} = await courseService.createCourse(req.body, req.user);

            const {
                teacher: teacherInfo,
                ...courseInfo
            } = course._doc || course;

            const channel = await this.conn.createChannel();

            //send data to QUEUE
            await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.COURSE_CHANGED,'', Buffer.from(JSON.stringify({
                courseInfo,
                teacherInfo,
                event: event.course.CREATE_COURSE
            })));

            res.status(status.OK).json(course);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    updateCourse = async(req, res)=>{
        try {
            const {id} = req.params;
            const payload = {
                _id: id,
                ...req.body
            }
            
            const {course} = await courseService.updateCourse(payload);

            const {
                teacher: teacherInfo,
                ...courseInfo
            } = course._doc || course;

            const channel = await this.conn.createChannel();

            //send data to QUEUE
            await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.COURSE_CHANGED,'', Buffer.from(JSON.stringify({
                courseInfo,
                teacherInfo,
                event: event.course.UPDATE_COURSE
            })));
            
            res.status(status.OK).json(course);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    deleteCourse = async(req, res)=>{
        try {
            const {id} = req.params;
            const {course} = await courseService.deleteCourse({id});

            const {
                teacher: teacherInfo,
                ...courseInfo
            } = course._doc || course;

            const channel = await this.conn.createChannel();
            //send data to QUEUE
            await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.COURSE_CHANGED,'', Buffer.from(JSON.stringify({
                courseInfo,
                teacherInfo,
                event: event.course.DELETE_COURSE
            })));

            res.status(status.OK).json(course);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    destroyCourse = async(req, res)=>{
        try {
            const {id} = req.params;
            const {course} = await courseService.destroyCourse({id});

            const {
                teacher: teacherInfo,
                ...courseInfo
            } = course._doc || course;

            const channel = await this.conn.createChannel();
            //send data to QUEUE
            await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.COURSE_CHANGED,'', Buffer.from(JSON.stringify({
                courseInfo,
                teacherInfo,
                event: event.course.DESTROY_COURSE
            })));

            res.status(status.OK).json(course);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    restoreCourse = async(req, res)=>{
        try {
            const {id} = req.params;
            const {course} = await courseService.restoreCourse({id});

            const {
                teacher: teacherInfo,
                ...courseInfo
            } = course._doc || course;

            const channel = await this.conn.createChannel();
            //send data to QUEUE
            await channel.assertExchange(queue.COURSE_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.COURSE_CHANGED,'', Buffer.from(JSON.stringify({
                courseInfo,
                teacherInfo,
                event: event.course.RESTORE_COURSE
            })));

            res.status(status.OK).json(course);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    createChapter = async(req, res)=>{
        try {
            //get id of course
            const _id = req.params.id;
            //get user input
            const {
                name, 
                lessons = '[]'  
            } = req.body;

            const {chapterInfo, index} = await courseService.createChapter({_id, name, lessons: JSON.parse(lessons)});
            const {course} = await courseService.getCourse(_id);
            const {
                lessons: lessonsInfo,
                ...payload
            } = chapterInfo;

            console.log(chapterInfo);

            const channel = await this.conn.createChannel();
            //send data to QUEUE
            await channel.assertExchange(queue.CHAPTER_CHANGED, 'fanout', { durable: false }); 
            await channel.publish(queue.CHAPTER_CHANGED, '', Buffer.from(JSON.stringify({
                courseId: _id,
                lessonsInfo,
                chapterInfo: payload,
                index,
                event: event.chapter.CREATE_CHAPTER
            })));

            lessonsInfo.forEach(async(lesson)=>{
                const {
                    kind
                } = lesson;
                await channel.assertQueue(queue.NOTIFY_PUBLISH);    
                await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                    userInfo: course.totalStudent || [],
                    dataInfo: {
                        lesson: lesson,
                        course: {
                            _id
                        }
                    },
                    event: event.notify.course[`CREATE_${kind.toUpperCase()}`]
                })));
            })
            res.status(status.OK).json({chapterInfo});
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    updateChapter = async(req, res)=>{
        try {
            const _id = req.params.id;
            
            const index = req.query.index;

            const {
                name, 
                lessons = '[]'
            } = req.body;

            const {chapterInfo} = await courseService.updateChapter({_id, index, name, lessons: JSON.parse(lessons)});

            const {
                lessons: lessonsInfo,
                ...payload
            } = chapterInfo;

            const channel = await this.conn.createChannel();
            //send data to QUEUE
            await channel.assertExchange(queue.CHAPTER_CHANGED, 'fanout', { durable: false }); 
            await channel.publish(queue.CHAPTER_CHANGED, '', Buffer.from(JSON.stringify({
                courseId: _id,
                lessonsInfo,
                chapterInfo: payload,
                index,
                event: event.chapter.UPDATE_CHAPTER
            })));
            res.status(status.OK).json({chapterInfo});
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    deleteChapter = async(req, res)=>{
        try {
            const {id} = req.params;
            const {index} = req.query;

            const {chapterInfo} = await courseService.deleteChapter({_id: id, index});

            const {
                lessons: lessonsInfo,
                ...payload
            } = chapterInfo;

            const channel = await this.conn.createChannel();
            //send data to QUEUE
            await channel.assertExchange(queue.CHAPTER_CHANGED, 'fanout', { durable: false }); 
            await channel.publish(queue.CHAPTER_CHANGED, '', Buffer.from(JSON.stringify({
                courseId: id,
                lessonsInfo,
                chapterInfo: payload,
                index,
                event: event.chapter.DESTROY_CHAPTER
            })));
            res.status(status.OK).json('delete successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getLesson = async(req, res)=>{
        try {
            const {id, lessonId} = req.params;

            const {lessonInfo} = await courseService.getLesson({id, lessonId});
            res.status(status.OK).json(lessonInfo);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    createLesson = async(req, res)=>{
        try {
            const {
                lessons = '[]'
            } = req.body;

            const {index} = req.query;
            const {id} = req.params;

            const {lessonsInfo} = await courseService.createLesson({
                lessons: JSON.parse(lessons),
                id,
                index
            })
            const {course} = await courseService.getCourse(id);

            const channel = await this.conn.createChannel();
            //send data to [PROGRESS, DISCUSSION]
            lessonsInfo.forEach(async(lesson)=>{
                const {
                    kind,
                    ...data
                } = lesson;
                await channel.assertExchange(queue.LESSON_CHANGED, 'fanout', { durable: false });
                await channel.publish(queue.LESSON_CHANGED,'', Buffer.from(JSON.stringify({
                    index,
                    courseId: id,
                    lessonInfo: lesson,
                    event: event[kind][`CREATE_${kind.toUpperCase()}`]
                })));
                
                            //send for notify service
                await channel.assertQueue(queue.NOTIFY_PUBLISH);    
                await channel.sendToQueue(queue.NOTIFY_PUBLISH, Buffer.from(JSON.stringify({
                    userInfo: course.totalStudent || [],
                    dataInfo: {
                        lesson: lesson,
                        course: {
                            _id
                        }
                    },
                    event: event.notify.course[`CREATE_${kind.toUpperCase()}`]
                })));
            })            

            res.status(status.OK).json(lessonsInfo);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    updateLesson = async(req, res)=>{
        try {
            const {id} = req.params;
            const {lessonId} = req.query;

            const {
                lesson
            } = req.body;

            const {lessonInfo} = await courseService.updateLesson({lesson: JSON.parse(lesson), lessonId});

            const channel = await this.conn.createChannel();
            //send data to [PROGRESS, DISCUSSION]
            const {
                kind,
                ...data
            } = lessonInfo;

            await channel.assertExchange(queue.LESSON_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.LESSON_CHANGED,'', Buffer.from(JSON.stringify({
                courseId: id,
                lessonInfo,
                event: event[kind.toLowerCase()][`UPDATE_${kind.toUpperCase()}`]
            })));
            res.status(status.OK).json('update lesson successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    deleteLesson = async(req, res)=>{
        try {
            const {lessonId, type} = req.query;

            const {id} = req.params;

            await courseService.deleteLesson({id, lessonId, type});

            const channel = await this.conn.createChannel();
            //send data to [PROGRESS, DISCUSSION]    
            await channel.assertExchange(queue.LESSON_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.LESSON_CHANGED,'', Buffer.from(JSON.stringify({
                courseId: id,
                lessonInfo: {_id: lessonId, kind: type},
                event: event[type.toLowerCase()][`DELETE_${type.toUpperCase()}`]
            })));
            res.status(status.OK).json('update lesson successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    destroyLesson = async(req, res)=>{
        try {
            const {lessonId, type} = req.query;
            const {id} = req.params;

            await courseService.destroyLesson({id, lessonId, type});

            const channel = await this.conn.createChannel();
            //send data to [PROGRESS, DISCUSSION]    
            await channel.assertExchange(queue.LESSON_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.LESSON_CHANGED,'', Buffer.from(JSON.stringify({
                courseId: id,
                lessonInfo: {_id: lessonId, kind: type},
                event: event[type.toLowerCase()][`DESTROY_${type.toUpperCase()}`]
            })));
            res.status(status.OK).json('update lesson successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    restoreLesson = async(req, res)=>{
        try {
            const {lessonId, type} = req.query;
            const {id} = req.params;

            await courseService.restoreLesson({id, lessonId, type});

            const channel = await this.conn.createChannel();
            //send data to [PROGRESS, DISCUSSION]    
            await channel.assertExchange(queue.LESSON_CHANGED, 'fanout', { durable: false });
            await channel.publish(queue.LESSON_CHANGED,'', Buffer.from(JSON.stringify({
                courseId: id,
                lessonInfo: {_id: lessonId, kind: type},
                event: event[type.toLowerCase()][`RESTORE_${type.toUpperCase()}`]
            })));

            res.status(status.OK).json('update lesson successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getAllCourses = async(req, res)=> {
        try {
            const {courses} = await courseService.getAllCourses();
            res.status(status.OK).json(courses);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    getCourse = async(req, res)=>{
        try {
            const {id} = req.params;
            const course = await courseService.getCourse(id);
            res.status(status.OK).json(course);
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    addCourseToWishlist = async(req, res)=>{
        try {
            const {id} = req.params;
            const {course: courseInfo} = await courseService.getCourse(id);

            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.WISHLIST_CHANGED);    
            await channel.sendToQueue(queue.WISHLIST_CHANGED, Buffer.from(JSON.stringify({
                userInfo: req.user,
                courseInfo,
                event: event.wishlist.ADD_TO_WISHLIST
            })));

            res.status(status.OK).json('add to wishlist successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    deleteCourseInWishlist = async(req, res)=>{
        try {
            const {id} = req.params;
            const {course: courseInfo} = await courseService.getCourse(id);

            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.WISHLIST_CHANGED);    
            await channel.sendToQueue(queue.WISHLIST_CHANGED, Buffer.from(JSON.stringify({
                userInfo: req.user,
                courseInfo,
                event: event.wishlist.REMOVE_TO_WISHLIST
            })));

            res.status(status.OK).json('remove to wishlist successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    addCourseToCart = async(req, res)=>{
        try {
            const {id} = req.params;
            const {course: courseInfo} = await courseService.getCourse(id);

            const channel = await this.conn.createChannel();
            await channel.assertExchange(queue.CART_CHANGED, 'fanout', { durable: false });    
            await channel.publish(queue.CART_CHANGED,'', Buffer.from(JSON.stringify({
                userInfo: req.user,
                courseInfo,
                event: event.cart.ADD_TO_CART
            })));

            res.status(status.OK).json('add to cart successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }

    deleteCourseInCart = async(req, res)=>{
        try {
            const {id} = req.params;
            const {course: courseInfo} = await courseService.getCourse(id);

            const channel = await this.conn.createChannel();
            await channel.assertExchange(queue.CART_CHANGED, 'fanout', { durable: false });    
            await channel.publish(queue.CART_CHANGED,'', Buffer.from(JSON.stringify({
                userInfo: req.user,
                courseInfo,
                event: event.cart.REMOVE_TO_CART
            })));

            res.status(status.OK).json('remove to cart successfully!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
    requestRatingCourse = async(req, res)=>{
        try {
            const {id} = req.params;
            const {course} = await courseService.requestRatingCourse(id, req.body, req.user);

            //send data to teacher_censor
            const channel = await this.conn.createChannel();
            await channel.assertQueue(queue.TEACHER_CENSOR);    
            await channel.sendToQueue(queue.TEACHER_CENSOR, Buffer.from(JSON.stringify({
                courseInfo: course,
                userInfo: req.user,
                message: req.body,
                event: event.teacher_censor.REQUEST_RATING
            })));
            res.status(status.OK).json('waiting for authorization!');
        } catch(err) {
            res.status(status.INTERNAL_ERROR).json(err.message);
        }
    }
}

module.exports = CourseController;