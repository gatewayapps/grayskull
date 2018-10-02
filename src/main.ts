import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import bodyParser from 'body-parser'
import config from 'config'
import express from 'express'
import next from 'next'
import path from 'path'
import pathMatch from 'path-match'
import Sequelize from 'sequelize'
import { parse } from 'url'
import db from './data'
import { ClientInstance } from './data/models/Client'
import { IClient } from './data/models/IClient'

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

    return app.render(req, res, '/login', req.query)
  })
  
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  console.log('Initializing database connection')
  // db.sequelize.sync().then(() => {
    /* eslint-disable no-console */
    server.listen(3000, (err) => {
      if (err) { throw err }
      console.log('Server ready on http://localhost:3000')
    })
  // }).catch((err) => {
  //   console.error(err)
  // })

})
