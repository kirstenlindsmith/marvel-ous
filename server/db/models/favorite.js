const Sequelize = require('sequelize')
const db = require('../db')

const Favorite = db.define('favorite', {
  userId: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
})

module.exports = Favorite
