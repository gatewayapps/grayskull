import Bluebird from 'bluebird'
import { IConfiguration } from '@data/models/IConfiguration'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser = require('cookie-parser')
import express, { Request, Response } from 'express'
import LoginController from './api/controllers/loginController'
import UserController from './api/controllers/userController'
import ClientService from './api/services/ClientService'
import UserAccountService from './api/services/UserAccountService'
import ConfigurationManager from './config/ConfigurationManager'
import { schema } from './data/graphql/graphql'
import { generateLoginUrl } from './utils/authentication'
import { getUserContext } from './middleware/authentication'
import { initializeDatabase, getContext } from '@data/context'
import { Server } from 'http'
import next from 'next'
import { startServerInstance } from './main'
import withCss from '@zeit/next-css'
import withSass from '@zeit/next-sass'
import ScopeService from '@services/ScopeService'

let FIRST_USER_CREATED: boolean = false

const NEXT_MODULES = ['next', 'webpack', 'tapable', '@zeit/next-css', '@zeit/next-sass', 'mini-css-extract-plugin']

const decache = require('decache')

let REALM_INSTANCE: RealmInstance

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
const HTTP_PORT = IS_DEVELOPMENT ? 3000 : 80

export function getInstance() {
  return REALM_INSTANCE
}

export class RealmInstance {
  public config?: IConfiguration
  private server!: express.Application
  private httpServer!: Server
  private app: next.Server
  private apolloServer!: ApolloServer
  private hostname: string
  private handle: any

  private static instance: RealmInstance

  public static restartServer() {
    RealmInstance.instance.stopServer().then(() => {
      startServerInstance()
    })
  }

  constructor(config?: IConfiguration) {
    REALM_INSTANCE = this
    RealmInstance.instance = this
    this.config = config
    this.initializeServer()
    this.initializeApolloServer()
    const withCss = require('@zeit/next-css')
    const withSass = require('@zeit/next-sass')
    const NEXT_CONFIG = withSass(withCss())
    this.app = next({ dev: IS_DEVELOPMENT, dir: './public', conf: NEXT_CONFIG })
    this.handle = this.app.getRequestHandler()

    this.hostname = this.config ? `${this.config.Server!.baseUrl}` : 'http://localhost'

    if (!config) {
      this.configureOobeServer().then(() => {
        this.startServer()
      })
    } else {
      this.prepareDatabase().then(() => {
        this.configureServer().then(() => {
          this.startServer()
        })
      })
    }
  }

  public stopServer() {
    this.httpServer.close()
    this.flushModules()

    return this.app.close().then(() => {
      delete this.config
      delete this.server
      delete this.httpServer
      delete this.app
      delete this.apolloServer
      delete this.hostname

      this.requireModules()
    })
  }

  private flushModules() {
    NEXT_MODULES.forEach((moduleName) => decache(moduleName))
  }

  private requireModules() {
    NEXT_MODULES.forEach((moduleName) => require(moduleName))
  }

  private initializeServer() {
    const server = express()
    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json())
    if (this.config) {
      server.use(cookieParser(this.config.Security!.globalSecret))
      server.use(this.firstUserMiddleware)
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
      context: ({ req, res }) => {
        return { req, res, user: req.user }
      }
    })
    apollo.applyMiddleware({ app: this.server, path: '/api/graphql' })
  }

  private startServer() {
    this.httpServer = this.server.listen(HTTP_PORT, (err: Error) => {
      if (err) {
        throw err
      }

      console.log(`Server ready at ${this.hostname}${IS_DEVELOPMENT ? ':3000' : ''}`)
    })
  }

  private async prepareDatabase() {
    initializeDatabase()
    const db = getContext()
    // console.log('Initializing database connection')
    await db.sequelize
      .sync()
      .then(this.ensureGrayskullClient)
      .catch((err) => {
        console.error(err)
      })
  }

  private async configureOobeServer() {
    await this.app.prepare()

    this.server.all('/oobe/?*|/static/*|/_next*', (req, res) => {
      return this.handle(req, res)
    })

    this.server.all('/restart', (req, res) => {
      this.stopServer().then(() => {
        new RealmInstance(undefined)
        Bluebird.delay(10000).then(() => {
          res.redirect('/oobe')
        })
      })
    })

    this.server.get('*', (req, res) => {
      res.redirect('/oobe')
    })
  }

  private async firstUserMiddleware(req: Request, res: Response, next: any) {
    if (!FIRST_USER_CREATED) {
      const userMeta = await UserAccountService.userAccountsMeta()
      FIRST_USER_CREATED = userMeta.count > 0
      res.locals['NEEDS_FIRST_USER'] = true
    } else {
      res.locals['NEEDS_FIRST_USER'] = false
    }
    next()
  }

  private async configureServer() {
    await this.app.prepare()

    this.server.use((req, res, nxt) => {
      req.baseUrl = `${req.protocol}://${req.hostname}${IS_DEVELOPMENT ? ':3000' : ''}`
      nxt()
    })

    // Server-side
    const routeControllers = [new LoginController(this.app), new UserController(this.app)]
    routeControllers.forEach((c) => c.registerRoutes(this.server))

    this.server.get('*', (req, res) => {
      return this.handle(req, res)
    })
  }
  private async ensureGrayskullClient(): Promise<void> {
    const grayskullClient = await ClientService.getClient({ client_id: 'grayskull' })
    if (!grayskullClient) {
      await ClientService.createClient({
        client_id: 'grayskull',
        name: ConfigurationManager.CurrentConfiguration!.Server!.realmName,
        secret: ConfigurationManager.CurrentConfiguration!.Security!.globalSecret,
        logoImageUrl: '/static/grayskull.gif',
        baseUrl: ConfigurationManager.CurrentConfiguration!.Server!.baseUrl,
        homePageUrl: `${ConfigurationManager.CurrentConfiguration!.Server!.baseUrl}/home`,
        redirectUris: JSON.stringify([`${ConfigurationManager.CurrentConfiguration!.Server!.baseUrl}/signin`]),
        scopes: JSON.stringify(ScopeService.getScopes().map((s) => s.id)),
        public: true
      })
    }
  }
}
