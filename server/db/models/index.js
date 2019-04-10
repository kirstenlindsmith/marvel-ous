const User = require('./user')
const Favorite = require('./favorite')

User.belongsToMany(Favorite, {as: 'Favorites', through: 'UserFavorites'})
Favorite.belongsToMany(User, {through: 'UserFavorites'})

module.exports = {
  User,
  Favorite
}
