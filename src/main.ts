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
import ClientService from './api/services/ClientService'
import UserAccountService from './api/services/UserAccountService'
import db from './data'
import { ClientInstance } from './data/models/Client'
import { IClient } from './data/models/IClient'

const securityOptions: any = config.get('Security')
const clients: any = config.get('Clients')
const general: any = config.get('General')

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
    if (req.query.clientId) {
      return ClientService.getClientByclientId(parseInt(req.query.clientId, 10)).then((client) => {
        res.locals.client = client
        return app.render(req, res, '/login', req.query)
      })
    } else {
      res.statusCode = 404
      res.send()
    }
  })

  server.post('/login', (req, res) => {
    if (req.query.clientId) {
      return ClientService.getClientByclientId(parseInt(req.query.clientId, 10)).then((client) => {
        res.locals.client = client
        return app.render(req, res, '/login', req.query)
      })
    } else {
      res.statusCode = 404
      res.send()
    }
  })

  server.get('/register', async (req, res) => {
    if (!req.query.cpt) {
      res.statusCode = 404
      res.send()
    } else {
      if (!UserAccountService.validateCPT(req.query.cpt)) {
        res.statusCode = 404
        res.send()
      } else {
        const decoded = UserAccountService.decodeCPT(req.query.cpt)
        res.locals.emailAddress = decoded.emailAddress
        if (decoded.clientId) {
          res.locals.client = await ClientService.getClientByclientId(decoded.clientId)
        } else if (decoded.admin) {
          res.locals.client = { name: `${general.realmName} Global Administrator` }
        }
        return app.render(req, res, '/register', req.query)
      }
    }
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  // console.log('Initializing database connection')
  db.sequelize
    .sync()
    .then(ensureClients)
    .then(ensureAdmin)
    .then(() => {
      /* eslint-disable no-console */
      server.listen(3000, (err) => {
        if (err) {
          throw err
        }
        console.log('Server ready on http://localhost:3000')
      })
    })
    .catch((err) => {
      console.error(err)
    })
})

function ensureClients(): Promise<any> {
  return Promise.all(
    clients.map((c) => {
      return ClientService.getClientByclientId(c.clientId).then((client) => {
        if (client) {
          return ClientService.updateClientByclientId(c, c.clientId)
        } else {
          return ClientService.createClient(c)
        }
      })
    })
  )
}

async function ensureAdmin(): Promise<any> {
  const user = await UserAccountService.getUserAccountByemailAddress(securityOptions.adminEmailAddress)
  if (!user) {
    // We use clientId -1 as admin
    UserAccountService.inviteAdmin()
  }
}
