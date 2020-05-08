module.exports = {
  port: 3000,
  session: {
    secret: 'test',
    key: 'test',
    maxAge: 43200 // session失效时间-毫秒,这里是12小时
  },
  mongodb: {
    url: 'mongodb://liaoyk_code:960926@101.132.139.165:27017/mongoBlog?authSource=mongoBlog' // 注意不仅要配置端口,还需要在后面接上数据库的name(这里是mongoBlog),authSource 表示权限认证来源数据库
  }
}
