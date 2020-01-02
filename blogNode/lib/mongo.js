const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const mongolass = new Mongolass()

mongolass.connect(config.mongodb.url)

// 根据id生成创建时间
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(item => {
      item.created_at = moment(objectIdToTimestamp())
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})

// 创建用户,后面是集合名称,但是mongolass插件会自动小写名称并在后面加一个's',所以这里到mongodb的集合的名称是users
exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }
})

exports.User.index({ name: 1 }, { unique: true }).exec()

// 发表文章
exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  pv: { type: 'number', default: 0 }
})

// 按创建时间降序查看用户的文章列表
exports.Post.index({ author: 1, _id: -1 }).exec()
