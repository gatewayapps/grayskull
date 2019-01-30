const express = require('express')
const passport = require('passport')
const request = require('request')
const { Strategy, Issuer } = require('openid-client')
const config = require('./config')
const session = require('express-session')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const grayskullIssuer = new Issuer({
  issuer: config.authServerBaseUrl,
  authorization_endpoint: `${config.authServerBaseUrl}/authorize`,
  token_endpoint: `${config.authServerBaseUrl}/token`,
  userinfo_endpoint: `${config.authServerBaseUrl}/userinfo`,
  jwks_uri: `${config.authServerBaseUrl}/jwks`
})

const params = {
  client_id: config.clientId,
  client_secret: config.secret,
  redirect_uri: `${config.clientBaseUrl}/callback`,
  response_type: 'code',
  scope: 'openid profile offline_access email'
}

const client = new grayskullIssuer.Client({
  client_id: config.clientId,
  id_token_signed_response_alg: 'HS256',
  client_secret: config.secret,
  redirect_uris: [`${config.clientBaseUrl}/callback`]
})

const passReqToCallback = false // optional, defaults to false, when true req is passed as a first
// argument to verify fn

const usePKCE = false

passport.use(
  'oidc',
  new Strategy(
    {
      client,
      params,
      passReqToCallback,
      usePKCE
    },
    (tokenset, userinfo, done) => {
      console.log('tokenset', tokenset)
      console.log('access_token', tokenset.access_token)
      console.log('id_token', tokenset.id_token)
      console.log('claims', tokenset.claims)
      console.log('userinfo', userinfo)
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

app.get('/login', passport.authenticate('oidc'))
app.get('/callback', passport.authenticate('oidc', { failureRedirect: '/login' }), (req, res) => {
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
