const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const mongolass = new Mongolass()

mongolass.connect(config.mongodb.url, { useNewUrlParser: true })

// 根据id生成创建时间,全局插件
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(item => {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
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

// 创建用户,后面是集合名称,但是mongoose(mongolass的依赖)插件会自动小写名称并在后面加一个's',所以这里到mongodb的集合的名称是users,除非指定第三个参数collection:'User'.
exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }
})

// exec是异步的,使用了promise来处理,返回值是插入数据库之后传回的参数
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

// 创建留言
exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  content: { type: 'string', required: true },
  postId: { type: Mongolass.Types.ObjectId, required: true }
})
// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ postId: 1, _id: 1 }).exec()
