## Express 框架使用  
#### 一.安装与实例化  
```
// 安装 
npm i express -S

//实例化

const express =  require('express')
const app = new express
```

#### 二.get 与 post 请求  
##### 1.get 请求  
```
app.get('/url/:data', function (req,res){})
```
- req.query: 解析后的 url 中的 querystring，如 ?name=lyk，req.query 的值为 {name: 'lyk'}
- req.params: 解析 url 中的占位符，如 /url/:name，访问 /url/lyk，req.params 的值为 {name: 'lyk'}


#### 三.Express 路由  express.Router()  
在主程序上注册路由
```
const userRouter = require('./routes/user')

app.use('/name',userRouter)
```
在路由文件上,配置路由:  
```
const express = require('express')
const router = express.Router()

router.get('/:name',function (req,res) {   // 路由可以有多个回调函数 router.get('path',callback[,callback])
  let name = req.params.name
  res.send(`Hello ${name}`)
})


module.exports = router
```
实际访问地址为:'xxxx(域名)/name/lyk' 返回 'Hello lyk', 主程序上的路径为一级路径,该引用路由上配置的为二级路径.  

#### 四.模板引擎  
>用来返回一个Html页面给前端,而不再只是单纯的文本  

模板引擎有很多,ejs是其中流行且易用的一个[ejs官方文档](https://ejs.bootcss.com/):  
```
npm i ejs -S

app.set('views',path.join(__dirname,'views')) // 设置模板文件存放路径
app.set('view engine','ejs')    // 指定模板引擎
```
在主程序设置完模板路径和引擎之后,使用render函数来渲染:
```
router.get('/:name',function (req,res) {
  let name = req.params.name
  // 第一个参数是模板名,第二个参数是传递的数据,同时会将响应头中的 Content-Type: text/html，告诉浏览器我返回的是 html
  res.render('users', {
    name: name
  })
})
```

**ejs介绍**  
- <% code %>：运行 JavaScript 代码，不输出 ,可以在其中写js方法循环生成标签等
- <%= code %>：显示转义后的 HTML内容
- <%- code %>：显示原始 HTML 内容
>注意：<%= code %> 和 <%- code %> 都可以是 JavaScript 表达式生成的字符串，当变量 code 为普通字符串时，两者没有区别。
当 code 比如为 \<h1>hello</h1> 这种字符串时，<%= code %> 会原样输出 \<h1>hello</h1>，会将标签转义成普通字符。
而 <%- code %> 则会显示 H1 大的 hello 字符串。

**ejs模板片段 include 方法:**  
ejs内置了 include 方法可以将模板片段凭借起来,*注意使用 <%- %>*
```
<%- include('./header') %> // include路径,
<p>
  <%= name.toUpperCase() %>
</p>

<br>
Hello , <%= name %>
<br>
<%- include('./footer') %>
```

#### 五.中间件  
>express的中间件(middleware)就是用来处理请求的,通过app.use的回调函数中的next()方法调用.
如果没有调用则不会传递给下一个中间件.

express有很多其他用户封装好的非常有效的中间件,开发时可以去各npm发布网站上查找

```
// 示例:
const express = require('express')
const app = new express()

app.use(function(req, res, next){
  console.log(1)
  next()   // 也可以抛出一个错误,中止请求 next(new Error('错误'))
})

app.use(function(req, res, next){
  console.log(2)
  res.status(200).end()  //res.status设置返回的状态吗,还可以设置很多其他东西,如请求头.JSONP状态码,cookie等
})

// 错误处理,如果上面的中间件出现了错误,会在这个方法里进行处理,需要err参数
app.use(function (err,req,res,next) {
  console.log('err是:'+err)
  res.status(500).send('处理了错误')
})

app.listen(80)
```
*注意:*
- express@4 之前的版本基于 connect 这个模块实现的中间件的架构，express@4 及以上的版本则移除了对 connect 的依赖自己实现了.
理论上基于 connect 的中间件（通常以 connect- 开头，如 connect-mongo）仍可结合 express 使用。

- 中间件的加载顺序很重要！比如：通常把日志中间件放到比较靠前的位置，后面将会介绍的 connect-flash 中间件是基于 session 的.
所以需要在 express-session 后加载。
