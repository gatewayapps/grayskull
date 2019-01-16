import db from '@data/context'
import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser = require('cookie-parser')
import express from 'express'
import next from 'next'
import LoginController from './api/controllers/loginController'
import UserController from './api/controllers/userController'
import ClientService from './api/services/ClientService'
import ScopeService from './api/services/ScopeService'
import ConfigurationManager from './config/ConfigurationManager'
import { schema } from './data/graphql/graphql'
import { generateLoginUrl } from './utils/authentication'
import { getUserContext } from './middleware/authentication'

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
    const portPart = !dev || ConfigurationManager.General.port === 80 ? '' : `:${ConfigurationManager.General.port}`
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
    context: ({ req, res }) => {
      return { req, res, user: req.user }
    }
  })
  apollo.applyMiddleware({ app: server, path: '/api/graphql' })

  // Server-side
  const routeControllers = [new LoginController(app), new UserController(app)]
  routeControllers.forEach((c) => c.registerRoutes(server))

  server.all('^/admin$|^/admin/*|^/home$|^/home/*', (req, res, next) => {
    if (!req.user) {
      const url = generateLoginUrl(req.protocol, req.hostname, { returnUrl: req.originalUrl })
      res.redirect(url)
    } else {
      next()
    }
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  // console.log('Initializing database connection')
  db.sequelize
    .sync()
    .then(ensureGrayskullClient)
    .then(() => {
      /* eslint-disable no-console */
      server.listen(ConfigurationManager.General.port || 3000, (err) => {
        if (err) {
          throw err
        }
        console.log(`Server ready on http://localhost:${ConfigurationManager.General.port || 3000}`)
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
      baseUrl: ConfigurationManager.General.fallbackUrl,
      homePageUrl: `${ConfigurationManager.General.fallbackUrl}/home`,
      redirectUris: JSON.stringify([`${ConfigurationManager.General.fallbackUrl}/signin`]),
      scopes: JSON.stringify(ScopeService.getScopes().map((s) => s.id)),
      public: true
    })
  }
}
