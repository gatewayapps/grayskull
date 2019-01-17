const jwt = require('jsonwebtoken')
const config = require('../config')
const fetch = require('isomorphic-fetch')

const ACCESS_TOKEN_COOKIE_NAME = 'access_token'
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token'

exports.requireAuth = async function (req, res, next) {
  if (req.cookies[ACCESS_TOKEN_COOKIE_NAME]) {
    try {
      const decoded = jwt.verify(req.cookies[ACCESS_TOKEN_COOKIE_NAME], config.secret)
      res.locals.user = decoded
      next()
      return
    } catch (err) {
      // Swallow error and fallback to using refreshToken
      console.error(err)
    }
  }

  if (req.cookies[REFRESH_TOKEN_COOKIE_NAME]) {
    // Attempt to verify refreshToken
    const reqOpts = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: config.clientId,
        client_secret: config.secret,
        refresh_token: req.cookies[REFRESH_TOKEN_COOKIE_NAME]
      })
    }
    const response = await fetch(`${config.authServerBaseUrl}/access_token`, reqOpts)

    if (response.status >= 400) {
      redirectToLogin(res, req.originalUrl)
      return
    }

    const jsonResponse = await response.json()

    if (!jsonResponse.access_token && !jsonResponse.refresh_token) {
      redirectToLogin(res, req.originalUrl)
      return
    }

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, jsonResponse.refresh_token)
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, jsonResponse.access_token, { maxAge: (jsonResponse.expires_in - 300) * 1000 })
    next()
    return
  }

  redirectToLogin(res, req.originalUrl)
  return
}

exports.completeSignin = async function (req, res) {
  const reqOpts = {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.secret,
      code: req.query.code
    })
  }

  const response = await fetch(`${config.authServerBaseUrl}/access_token`, reqOpts)

  if (response.status >= 400) {
    redirectToLogin(res, '/')
    return
  }

  const jsonResponse = await response.json()

  if (!jsonResponse.access_token && !jsonResponse.refresh_token) {
    redirectToLogin(res, '/')
    return
  }

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, jsonResponse.refresh_token)
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, jsonResponse.access_token, { maxAge: (jsonResponse.expires_in - 300) * 1000 })

  let returnPath = '/'
  if (req.query.state) {
    try {
      const stateObj = JSON.parse(Buffer.from(req.query.state, 'base64').toString('ascii'))
      if (stateObj.returnPath) {
        returnPath = stateObj.returnPath
      }
    } catch (err) {
      console.error(err)
    }
  }

  res.redirect(`${config.clientBaseUrl}${returnPath}`)
}

function redirectToLogin(res, returnPath) {
  const stateObj = {
    returnPath
  }
  const state = Buffer.from(JSON.stringify(stateObj), 'utf8').toString('base64')
  const query = [`client_id=${config.clientId}`, 'response_type=code', `redirect_uri=${encodeURIComponent(`${config.clientBaseUrl}/signin`)}`, `state=${state}`]
  res.redirect(`${config.authServerBaseUrl}/authorize?${query.join('&')}`)
  return
}
