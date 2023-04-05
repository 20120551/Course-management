module.exports = {
    connectDatabase: require('./connect-model'),
    courseRepository: require('./repository/course-repository'),
    lectureRepository: require('./repository/lecture-repository'),
    exerciseRepository: require('./repository/exercise-repository'),
}