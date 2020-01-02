const Post = require('../lib/mongo.js').Post

// markdown文件解析库
const marked = require('marked')

// 将 post 的 content 由 markdown 转化为html格式 局部插件
Post.plugin('contentToHtml', {
  afterFind: (posts) => {
    return posts.map(post => {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: (post) => {
    if (post.content) {
      post.content = marked(post.content)
    }
    return post
  }
})
module.exports = {
  create: function create (post) {
    return Post.create(post).exec()
  },
  getPostById: (postId) => {
    // populate mongoose的填充查询,相当于关系数据库的连接查询,会根据path去指定的User中查询对应数据,author只能是几种(_id,sting,buffer,number等),推荐使用_id
    return Post.findOne({ _id: postId }).populate({ path: 'author', model: 'User' }).addCreatedAt().contentToHtml().exec()
  },
  // 按日期降序获取某个用户的所有文章
  getPosts: (author) => {
    const query = {}
    // 点击用户头像时只查找该特定用户的文章,否则查找所有文章
    if (author) {
      query.author = author
    }
    return Post.find({ author: '5dee1ec86de3081e28020d33' }).populate({ path: 'author', model: 'User' }).sort({ _id: -1 }).addCreatedAt().contentToHtml().exec()
  },
  // 浏览增加 $inc方法为mongodb中的相加,将pv值加上他后面的数字,可以加负数,还有$set,$unset,$push等方法
  incPv: (postId) => {
    return Post.update({ _id: postId }, { $inc: { pv: 1 } }).exec()
  }
}