import { IConfiguration } from '@data/models/IConfiguration'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser = require('cookie-parser')
import express from 'express'
import next from 'next'
import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import LoginController from './api/controllers/loginController'
import UserController from './api/controllers/userController'
import ClientService from './api/services/ClientService'
import UserAccountService from './api/services/UserAccountService'
import ConfigurationManager from './config/ConfigurationManager'
import { schema } from './data/graphql/graphql'
import { generateLoginUrl } from './utils/authentication'
import { getUserContext } from './middleware/authentication'
import db from '@data/context'

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
const HTTP_PORT = IS_DEVELOPMENT ? 3000 : 80
const app = next({ dev: IS_DEVELOPMENT, dir: './public', conf: withSass(withCss()) })
const handle = app.getRequestHandler()

export class RealmInstance {
  private config: IConfiguration
  private server!: express.Application
  private apolloServer!: ApolloServer
  private hostname: string

  constructor(config: IConfiguration) {
    this.config = config
    this.initializeServer()
    this.initializeApolloServer()

    this.hostname = this.config ? `${this.config.Server!.baseUrl}` : 'http://localhost'

    if (!config) {
      this.configureOobeServer().then(() => {
        this.startServer()
      })
    } else {
      this.configureServer().then(() => {
        this.startServer()
      })
    }
  }

  private initializeServer() {
    const server = express()
    server.use(bodyParser.urlencoded())
    server.use(bodyParser.json())
    if (this.config) {
      server.use(cookieParser(this.config.Security!.globalSecret))
      server.use(getUserContext)
    }

    this.server = server
  }

  private initializeApolloServer() {
    const apollo = new ApolloServer({
      schema,
      playground: IS_DEVELOPMENT,
      introspection: IS_DEVELOPMENT,
      formatError: (error) => {
        console.log(error)
        return new Error('Internal server error')
      },
      context: ({ req }) => {
        return { user: req.user }
      }
    })
    apollo.applyMiddleware({ app: this.server, path: '/api/graphql' })
  }

  private startServer() {
    this.server.listen(HTTP_PORT, (err: Error) => {
      if (err) {
        throw err
      }

      console.log(`Server ready at ${this.hostname}${IS_DEVELOPMENT ? ':3000' : ''}`)
    })
  }

  private async configureOobeServer() {
    await app.prepare()

    this.server.all('/oobe/?*|/static/*|/_next*', (req, res) => {
      return handle(req, res)
    })

    this.server.get('*', (req, res) => {
      res.redirect('/oobe')
    })
  }

  private async configureServer() {
    await app.prepare()

    this.server.use((req, res, nxt) => {
      req.baseUrl = `${req.protocol}://${req.hostname}${IS_DEVELOPMENT ? ':3000' : ''}`
      nxt()
    })

    // Server-side
    const routeControllers = [new LoginController(app), new UserController(app)]
    routeControllers.forEach((c) => c.registerRoutes(this.server))

    this.server.all('^/admin$|^/admin/*|^/home$|^/home/*', (req, res, next) => {
      if (!req.user) {
        const url = generateLoginUrl(req.protocol, req.hostname, { returnUrl: req.originalUrl })
        res.redirect(url)
      } else {
        next()
      }
    })

    this.server.get('*', (req, res) => {
      return handle(req, res)
    })

    // console.log('Initializing database connection')
    return db.sequelize
      .sync()
      .then(this.ensureGrayskullClient)
      .catch((err) => {
        console.error(err)
      })
  }
  private async ensureGrayskullClient(): Promise<void> {
    const grayskullClient = await ClientService.getClient({ client_id: ConfigurationManager.General.grayskullClientId })
    if (!grayskullClient) {
      await ClientService.createClient({
        client_id: ConfigurationManager.General.grayskullClientId,
        name: ConfigurationManager.General.realmName,
        secret: ConfigurationManager.Security.globalSecret,
        logoImageUrl: '/static/grayskull.gif',
        baseUrl: ConfigurationManager.General.fallbackUrl,
        homePageUrl: `${ConfigurationManager.General.fallbackUrl}/home`,
        redirectUri: `${ConfigurationManager.General.fallbackUrl}/signin`,
        public: true
      })
    }
  }
}
