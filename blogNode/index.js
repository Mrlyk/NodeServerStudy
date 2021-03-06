const path = require('path')
const express = require('express')
const routes = require('./routes')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const pkg = require('./package')

const app = express()

// 设置模板目录,模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// session 中间件
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  useUnifiedTopology: true,
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url: config.mongodb.url
  })
}))

// flash中间件用来显示通知
app.use(flash())

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true// 保留后缀
}))

// 模板渲染时,express会按照res.render > app.locals > res.locals 优先级将变量传入模板
// 设置模板全局常量,express在渲染时会merge该常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模板必需的三个变量,express在渲染时会merge该变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

routes(app)

// 拦截路由跳转的错误信息
app.use(function (err, req, res, next) {
  console.error(err)
  req.flash('error', err.message)
  res.redirect('/posts')
})

app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
  console.log('http://localhost:3000')
})
