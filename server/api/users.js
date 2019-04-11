const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

//api/users

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email']
    })

    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.get('/:userId', async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId){
      const user = await User.findById(req.params.userId)
      res.json(user)
    }
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const username = req.body.email

    const newUser = await User.create({password, email, username})
    res.json(newUser)
  } catch (err) {
    next(err)
  }
})
