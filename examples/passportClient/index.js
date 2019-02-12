const moment = require('moment')
const express = require('express')
const passport = require('passport')
const request = require('request')
const { Strategy, Issuer } = require('openid-client')
const config = require('./config')
const session = require('express-session')
const jwt = require('jsonwebtoken')
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
  response_type: 'id_token',
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
      console.log(tokenset)
      console.log(userinfo)
      const idToken = jwt.verify(tokenset.id_token, config.secret)
      console.log(idToken)
      //userinfo.expiresAt = tokenset.claims.exp
      //userinfo.refreshToken = tokenset.refresh_token
      return done(null, idToken)
    }
  )
)

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user))
})

passport.deserializeUser(async function(id, done) {
  let userInfo = JSON.parse(id)
  // if (userInfo.expiresAt < moment().unix()) {
  //   const refresh_token = userInfo.refreshToken
  //   const result = await client.refresh(refresh_token)
  //   userInfo = await client.userinfo(result.access_token)
  //   userInfo.refreshToken = refresh_token
  //   userInfo.expiresAt = result.claims.exp
  //   console.log('NEW USER INFO', userInfo)
  // }
  done(null, userInfo)
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
      if (req.user.expiresAt < moment().unix()) {
        req.login(req.user, (err) => {
          next()
        })
      } else {
        next()
      }
    } else {
      res.redirect('/login')
    }
  },
  (req, res) => {
    const keys = Object.keys(req.user)
    const listItems = []
    keys.forEach((k) => {
      listItems.push(`<li><b>${k}</b>: ${req.user[k]}</li>`)
    })
    res.send(`<html><body><h1>User Details</h1><ul>${listItems.join('\n')}</ul></body></html>`)
  }
)

app.listen(5001, (err) => {
  console.log('listening on 5001')
})
