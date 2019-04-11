const passport = require('passport')
const router = require('express').Router()
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const AuthKeys = require('../../secrets')
const {User} = require('../db/models')
module.exports = router

const {GoogleCallback} = AuthKeys
 
/**
 * format from `secrets.js`:
 *
 * process.env.GOOGLE_CLIENT_ID = 'google client id'
 * process.env.GOOGLE_CLIENT_SECRET = 'google client secret'
 * process.env.GOOGLE_CALLBACK = '/auth/google/callback'
 */

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Google client ID / secret not found. Skipping Google OAuth.')
} else {
  const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GoogleCallback
  }

  const strategy = new GoogleStrategy(
    googleConfig,
    async (token, refreshToken, profile, done) => {
      const googleId = profile.id
      const email = profile.emails[0].value

    User.findOrCreate({
        where: {googleId},
        defaults: {email}
      })
        .then(([user]) => done(null, user))
        .catch(done)
     
    }
  )

  passport.use(strategy)

  router.get('/', passport.authenticate('google', {scope: 'email'}))

  router.get(
    '/callback',
    passport.authenticate('google', {
      successRedirect: '/home',
      failureRedirect: '/login'
    })
  )
}
