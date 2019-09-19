const express = require('express')
const router = express.Router()

router.get('/:name',function (req,res) {
  let name = req.params.name
  // res.send(`Hello ${name}`)
  res.render('users', {
    name: name
  })
})


module.exports = router
