module.exports = {
    connect: require('./connect'),
    userRepository: require('./repository/user-repository'),
    roleRepository: require('./repository/role-repository'),
    permissionRepository: require('./repository/permission-repository'),
    refreshTokenRepository: require('./repository/refreshToken-repository'),
    studentRepository: require('./repository/student-repository'),
    educatorRepository: require('./repository/educator-repository'),
    addressRepository: require('./repository/address-repository'),
}