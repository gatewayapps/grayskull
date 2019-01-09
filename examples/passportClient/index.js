const express = require('express')
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2')
const config = require('./config')
const session = require('express-session')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: `${config.authServerBaseUrl}/auth`,
      tokenURL: `${config.authServerBaseUrl}/access_token`,
      clientID: config.clientId,
      clientSecret: config.secret,
      callbackURL: `${config.clientBaseUrl}/callback`
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile)
      console.log(accessToken)

      return cb(null, { username: 'test user', email: 'test@test.com' })
    }
  )
)

passport.serializeUser(function(user, done) {
  console.log('serializing user', user)
  done(null, JSON.stringify(user))
})

passport.deserializeUser(function(id, done) {
  console.log('deserializing user', id)
  done(null, JSON.parse(id))
})

const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/login', passport.authenticate('oauth2'))
app.get('/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/')
})
app.get(
  '*',
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  },
  (req, res) => {
    res.send('<html><body><h1>success!!!</h1></body></html>')
  }
)

app.listen(5001, (err) => {
  console.log('listening on 5001')
})
