module.exports = {
  port: 3000,
  session: {
    secret: 'test',
    key: 'test',
    maxAge: 2592000000 // session失效时间-毫秒,这里是30天
  },
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/mongoBlog' // 注意不仅要配置端口,还需要在后面街上数据库的name(这里是mongoBlog)
  }
}
