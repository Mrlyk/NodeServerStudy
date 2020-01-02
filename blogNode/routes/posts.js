const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts.js')

const checkLogin = require('../middleware/check').checkLogin

router.get('/', function (req, res, next) {
  const author = req.query.author

  PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        posts: posts
      })
    })
    .catch((e) => {
      res.send('debug')
      next()
    })
})

// POST /posts/create 发表一篇文章,注意这是post请求,是点击发表的时候使用
router.post('/create', checkLogin, function (req, res, next) {
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  let post = {
    author: author,
    title: title,
    content: content
  }
  PostModel.create(post).then(result => {
    // post 是插入完成后的返回值
    post = result.ops[0]
    req.flash('success', '发表成功')
    // 发表成功后跳转到该文章页
    res.redirect(`/posts/${post._id}`)
  }).catch(next)
})

// GET /posts/create 发表文章页,注意这是get请求,渲染发表页内容
router.get('/create', checkLogin, function (req, res, next) {
  res.render('creates')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  const postId = req.params.postId

  Promise.all([
    PostModel.getPostById(postId), // 获取文章信息
    PostModel.incPv(postId)// pv 加 1
  ])
    .then(function (result) {
      const post = result[0]
      if (!post) {
        throw new Error('该文章不存在')
      }

      res.render('post', {
        post: post
      })
    })
    .catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  res.send('更新文章')
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('删除文章')
})

module.exports = router
