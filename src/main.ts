import db from '@data/context'
import { ClientInstance } from '@data/models/Client'
import { IClient } from '@data/models/IClient'
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
import LoginController from './api/controllers/loginController'
import UserController from './api/controllers/userController'
import ClientService from './api/services/ClientService'
import UserAccountService from './api/services/UserAccountService'

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

  const lc = new LoginController(app)
  lc.registerRoutes(server)

  const uc = new UserController(app)
  uc.registerRoutes(server)

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
        if (!res.locals.client) {
          res.statusCode = 404
          res.send()
        } else {
          return app.render(req, res, '/register', req.query)
        }
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
