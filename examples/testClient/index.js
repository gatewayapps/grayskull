const express = require('express')
const cookieParser = require('cookie-parser')
const next = require('next')
const authMiddleware = require('./middleware/auth')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(cookieParser())

  server.get('/signin', authMiddleware.completeSignin)

  server.get('*', authMiddleware.requireAuth, (req, res) => {
    handle(req, res)
  })

  server.listen(5000, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log(`Listening at http://localhost:5000/`)
  })
})
