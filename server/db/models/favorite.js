const Sequelize = require('sequelize')
const db = require('../db')

const Favorite = db.define('favorite', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

module.exports = Favorite

//http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150&name=${name}
