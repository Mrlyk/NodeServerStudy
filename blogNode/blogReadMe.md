## Node搭建一个blog  
#### 项目结构:  
1. models: 存放数据库操作文件  
2. public: 存放静态文件,如图片等  
3. routes: 路由文件  
4. config: 项目配置文件存放  
5. views: 存放模板文件  
6. index.js: 程序主文件  

**所需模块:**  
1. express: web 框架
2. express-session: session 中间件(服务器上的session)
3. connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
4. connect-flash: 页面通知的中间件，基于 session 实现
5. ejs: 模板
6. express-formidable: 接收表单及文件上传的中间件(从github安装,1.0版本有bug:'https://github.com:utatti/express-formidable.git')
7. config-lite: 读取配置文件
8. marked: markdown 解析
9. moment: 时间格式化
10. mongolass: mongodb 驱动
11. objectid-to-timestamp: 根据 ObjectId 生成时间戳
12. sha1: sha1 加密，用于密码加密
13. winston: 日志
14. express-winston: express 的 winston 日志中间件
15. eslint 代码风格格式化工具 (eslint --init生成初始化文件)

#### 项目配置:  
1.config-lite : 读取并合并配置文件  
>如果程序以 NODE_ENV=test node app 启动，则 config-lite 会依次降级查找 config/test.js、config/test.json、config/test.node、config/test.yml、config/test.yaml 并合并 default 配置; 
如果程序以 NODE_ENV=production node app 启动，则 config-lite 会依次降级查找 config/production.js、config/production.json、config/production.node、config/production.yml、config/production.yaml 并合并 default 配置。

config-lite 还支持冒泡查找配置，即从传入的路径开始，从该目录不断往上一级目录查找 config 目录，直到找到或者到达根目录为止。  

2.connect-flash  
>connect-flash 是基于 session 实现的，它的原理很简单：设置初始值 req.session.flash={}，通过 req.flash(name, value) 设置这个对象下的字段和值，通过 req.flash(name) 获取这个对象下的值，同时删除这个字段，实现了只显示一次刷新后消失的功能。

*express-session、connect-mongo 和 connect-flash 的区别与联系:*
- express-session: 会话（session）支持中间件
- connect-mongo: 将 session 存储于 mongodb，需结合 express-session 使用，我们也可以将 session 存储于 redis，如 connect-redis
- connect-flash: 基于 session 实现的用于通知功能的中间件，需结合 express-session 使用
