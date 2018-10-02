import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import bodyParser from 'body-parser'
import config from 'config'
import express from 'express'
import next from 'next'
import path from 'path'
import pathMatch from 'path-match'
import { parse } from 'url'
import db from './data'
db.sequelize.authenticate().then(() => {
  db.sequelize.sync().then(() => {

    db.Client.create({
      name: 'Test'
    }).then((client) => {
      console.log(client)
    })
  })
})

const securityOptions = config.get('Security')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: './public', conf: withSass(withCss()) })
const handle = app.getRequestHandler()

// const apiRoutes = require('./server/routes/apiRoutes.js');

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.urlencoded())
  // server.use('/api', apiRoutes);

  // Server-side
  const route = pathMatch()

  server.get('/login', (req, res) => {
    return app.render(req, res, '/login', req.query)
  })

  server.post('/login', (req, res) => {
    res.locals.error = { message: 'suck it' }
    return app.render(req, res, '/login', { data: { name: 'daniel', blah: 'what', more: 123 }, ...req.query })
  })

  server.get('/artist/:id', (req, res) => {
    const params = route('/artist/:id')(parse(req.url).pathname)
    return app.render(req, res, '/artist', params)
  })

  server.get('/album/:id', (req, res) => {
    const params = route('/album/:id')(parse(req.url).pathname)
    return app.render(req, res, '/album', params)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  /* eslint-disable no-console */
  server.listen(3000, (err) => {
    if (err) { throw err }
    console.log('Server ready on http://localhost:3000')
  })
})
