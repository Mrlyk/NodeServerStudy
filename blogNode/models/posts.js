const Post = require('../lib/mongo.js').Post
const CommentModel = require('./comments.js')

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
    if (post && post.content) {
      post.content = marked(post.content)
    }
    return post
  }
})

// 给post添加留言数
Post.plugin('addCommentsCount', {
  afterFind: (posts) => {
    return Promise.all(posts.map(post => {
      return CommentModel.getCommentsCount(post._id).then(commentsCount => {
        post.commentsCount = commentsCount
        return post
      })
    }))
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(function (count) {
        post.commentsCount = count
        return post
      })
    }
    return post
  }
})

module.exports = {
  create: function create (post) {
    return Post.create(post).exec()
  },
  // 获取文章
  getPostById: (postId) => {
    // populate mongoose的填充查询,相当于关系数据库的连接查询,会根据path去指定的User中查询对应数据,author只能是几种(_id,sting,buffer,number等),推荐使用_id
    return Post.findOne({ _id: postId }).populate({ path: 'author', model: 'User' }).addCreatedAt().addCommentsCount().contentToHtml().exec()
  },
  // 获取未marked转码的原生文章来编辑
  getRawPostById: (postId) => {
    return Post.findOne({ _id: postId }).populate({ path: 'author', model: 'User' }).addCreatedAt().exec()
  },
  // 更新文章
  updatePostById: (postId, data) => {
    return Post.update({ _id: postId }, { $set: data }).exec()
  },
  // 按日期降序获取某个用户的所有文章
  getPosts: (author) => {
    const query = {}
    // 点击用户头像时只查找该特定用户的文章,否则查找所有文章
    if (author) {
      query.author = author
    }
    // 踩坑:查询报错查看插件方法(addCreatedAt,contentToHtml)有没有写错,不一定是查询本身错误.
    return Post.find(query).populate({ path: 'author', model: 'User' }).sort({ _id: -1 }).addCreatedAt().addCommentsCount().contentToHtml().exec()
  },
  // 浏览增加 $inc方法为mongodb中的相加,将pv值加上他后面的数字,可以加负数,还有$set,$unset,$push等方法
  incPv: (postId) => {
    return Post.update({ _id: postId }, { $inc: { pv: 1 } }).exec()
  },
  // 删除文章
  delPostById: (postId) => {
    return Post.deleteOne({ _id: postId }).exec()
      .then(res => {
        // 文章删除后删除留言
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsByPostId(postId)
        }
      })
  }
}
