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

//full url with keys etc: https://gateway.marvel.com/v1/public/characters?ts=1554912319543&apikey=b6960a4c0750dbaec9df3cf50f90f15d&hash=c8a5630951a6dab519f14b75b988aa0a&offset=0&orderBy=name&limit=20
