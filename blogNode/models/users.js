const Users = require('../lib/mongo').User

module.exports = {
  // 注册一个用户
  create: function create (user) {
    return Users.create(user).exec()
  },
  // 通过用户名获取用户信息(登录),addCreatedAt是插件,通过_id生成时间戳
  getUserByName: function getUserByName (name) {
    return Users.findOne({ name: name }).addCreatedAt().exec()
  }
}
