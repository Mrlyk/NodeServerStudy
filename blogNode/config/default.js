module.exports = {
  port: 3000,
  session: {
    secret: 'test',
    key: 'test',
    maxAge: 2592000000 // session失效时间-毫秒,这里是30天
  },
  mongodb: {
    url: 'mongodb://101.132.139.165:27017/mongoBlog' // 注意不仅要配置端口,还需要在后面接上数据库的name(这里是mongoBlog)
  }
}
