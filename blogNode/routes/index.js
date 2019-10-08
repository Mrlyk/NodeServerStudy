module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts')
  })

  app.use('/signUp', require('./signUp'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
}
