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

#### 三.Express 路由  express.Router
