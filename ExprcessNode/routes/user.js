const express = require('express')
const router = express.Router()

router.get('/:name',function (req,res) {
  let name = req.params.name
  res.send(`Hello ${name}`)
})


module.exports = router
