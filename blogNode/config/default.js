module.exports = {
  port: 6666,
  session: {
    secret: 'test',
    key: 'test',
    maxAge: 2592000000 // session失效时间-毫秒,这里是30天
  },
  mongodb: 'mongodb://127.0.0.1:27017'
}
