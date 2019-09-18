const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')

app.use(indexRouter)
app.use(userRouter)

/*
app.get('/',function (req,res) {
  res.send('Hello Express!')
})
// express使用了 path-to-regexp 模块,会使用正则将冒号后的参数作为request.params中的值
app.get('/user/:name',function (req,res) {
  // console.log(req.params)
  let name = req.params.name
  res.send(`Hello ${name}`)
})
*/
app.listen('80')
