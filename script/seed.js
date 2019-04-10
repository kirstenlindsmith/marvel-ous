'use strict'

const db = require('../server/db')
const {User, Favorite} = require('../server/db/models')

const users = [
  {
    email: 'buffy@email.com',
    password: '1234'
  },
  {
    email: 'kirsten@email.com',
    password: '1234',
  }

]

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')
  try {
    await Promise.all(
      users.map(user => {
        return User.create(user)
      })
    )
    console.log(`successfully seeded ${users.length} users`)
  } catch (error) {
    console.error('Error seeding users:', error)
  }

  const createdUsers = await User.findAll()

  try {
    await Promise.all(
      createdUsers.map(user=> {
        return Favorite.create({name: 'Spider-Man', userId: user.id})
      })
    )
    console.log(`successfully seeded ${users.length} user Favorites`)
  } catch (error) {
    console.error('Error seeing user favorites:', error)
  }
}

// separating `seed` function from the `runSeed` function for error handling
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

// exporting seed function for testing purposes
module.exports = seed
