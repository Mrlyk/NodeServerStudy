module.exports = {
  port: 6666,
  session: {
    secret: 'test',
    key: 'test',
    maxAge: 2592000000 // session失效时间-毫秒,这里是30天
  },
  mongodb: 'mongodb://101.132.139.165:27017'
}
