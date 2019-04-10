const router = require('express').Router()
const {Favorite} = require('../db/models')
module.exports = router

//default route is /api/favorites
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const faves = await Favorite.findAll({
      where: {
        userId
      }
    })
    res.json(faves)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const name = req.body.name
    const userId = req.user.id
    const newFave = await Favorite.create({name, userId})
    res.json(newFave)
  } catch (err) {
    next(err)
  }
})

router.delete('/:faveName', async (req, res, next) => {
  try {
    const userId = req.user.id
    await Favorite.destroy({
      where: {
        name: req.params.faveName,
        userId
      }
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
