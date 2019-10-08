const express = require('express')
const router = express.Router()

const checkLogin = require('../middleware/check').checkLogin

router.post('/', checkLogin, function (res, req, next) {
  res.send('创建留言')
})

router.post('/:commentId/remove',checkLogin, function (res,req,next) {
  res.send('删除留言')
})

module.exports = router
