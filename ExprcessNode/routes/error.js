const express = require('express')
const router = express.Router()

router.use(function (req,res,next) {
  console.log('1111')
  next()
})

router.use(function (req,res,next) {
  console.log('222')
  next(new Error('test error'))
})

router.get('/',function (req,res) {
  res.send('出现了error!')
})

router.use(function (err,req,res,next) {
  console.log('err是:'+err)
  res.status(500).send('处理了错误')
})

module.exports = router
