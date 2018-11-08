import db from '@data/context'
import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser = require('cookie-parser')
import express from 'express'
import next from 'next'
import pathMatch from 'path-match'
import LoginController from './api/controllers/loginController'
import UserController from './api/controllers/userController'
import ClientService from './api/services/ClientService'
import UserAccountService from './api/services/UserAccountService'
import ConfigurationManager from './config/ConfigurationManager'
import { schema } from './data/graphql/graphql'
import { getUserContext } from './middleware/authentication'

const clients = require(ConfigurationManager.General.clientsFilePath)

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: './public', conf: withSass(withCss()) })
const handle = app.getRequestHandler()

// const apiRoutes = require('./server/routes/apiRoutes.js');

app.prepare().then(() => {
  const server = express()
  server.use(cookieParser(ConfigurationManager.Security.globalSecret))
  server.use(bodyParser.urlencoded())
  server.use(bodyParser.json())
  server.use(getUserContext)

  server.use((req, res, nxt) => {
    const portPart = ConfigurationManager.General.port === 80 ? '' : `:${ConfigurationManager.General.port}`
    req.baseUrl = `${req.protocol}://${req.hostname}${portPart}`
    nxt()
  })

  const apollo = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    formatError: (error) => {
      console.log(error)
      return new Error('Internal server error')
    },
    context: ({ req }) => {
      return { user: req.user }
    }
  })
  apollo.applyMiddleware({ app: server, path: '/api/graphql' })

  // Server-side
  const routeControllers = [new LoginController(app), new UserController(app)]
  routeControllers.forEach((c) => c.registerRoutes(server))

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  // console.log('Initializing database connection')
  db.sequelize
    .sync()
    .then(ensureGrayskullClient)
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

async function ensureGrayskullClient(): Promise<void> {
  const grayskullClient = await ClientService.getClient({ client_id: ConfigurationManager.General.grayskullClientId })
  if (!grayskullClient) {
    await ClientService.createClient({
      client_id: ConfigurationManager.General.grayskullClientId,
      name: ConfigurationManager.General.realmName,
      secret: ConfigurationManager.Security.globalSecret,
      logoImageUrl: '/static/grayskull.gif',
      url: ConfigurationManager.General.fallbackUrl,
      redirectUri: `${ConfigurationManager.General.fallbackUrl}/signin`,
    })
  }
}

async function ensureAdmin(): Promise<void> {
  const user = await UserAccountService.getUserAccount({ emailAddress: ConfigurationManager.Security.adminEmailAddress })
  if (!user) {
    UserAccountService.inviteAdmin(ConfigurationManager.General.fallbackUrl)
  }
}
