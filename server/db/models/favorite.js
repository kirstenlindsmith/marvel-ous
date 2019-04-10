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

//query url format: http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150&name=${name}
