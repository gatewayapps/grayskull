import { IConfiguration } from '@data/models/IConfiguration'
import db from './data/context'
import { default as express, Application as ExpressApplication } from 'express'
import { default as http, Server as HttpServer } from 'http'
import { default as https, Server as HttpsServer } from 'https'
import { SecureContext, createSecureContext } from 'tls'
import { default as next } from 'next'

import { UrlObject, Url } from 'url'
import bodyParser = require('body-parser')
import cookieParser = require('cookie-parser')
import httpsRedirect from 'express-https-redirect'
import CertificateService, { GreenlockMiddleware } from './api/services/CertificateService'
import { getUserContext, firstUserMiddleware } from './middleware/authentication'
import LoginController from './api/controllers/loginController'
import UserController from './api/controllers/userController'
import { ApolloServer } from 'apollo-server-express'
import { schema } from '@data/graphql/graphql'
import ClientRepository from '@data/repositories/ClientRepository'
import ConfigurationManager from './config/ConfigurationManager'
import ScopeService from '@services/ScopeService'
import OAuthController from './api/controllers/oauthController'
import { CONFIG_DIR } from './constants'

const decache = require('decache')
const NEXT_MODULES = ['next', 'webpack', 'tapable', '@zeit/next-css', '@zeit/next-sass', 'mini-css-extract-plugin']
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'

let REALM_INSTANCE: RealmInstance

export const getInstance = () => REALM_INSTANCE

export class RealmInstance {
  private config: IConfiguration | undefined
  private expressApp: ExpressApplication
  private nextServer: any
  private httpServer: HttpServer
  private httpsServer: HttpsServer
  private apolloServer: ApolloServer
  private secureContext!: SecureContext
  private requestHandler: (req: http.IncomingMessage, res: http.ServerResponse, parsedUrl?: UrlObject | Url | undefined) => Promise<void>

  /**
   * Create a Grayskull Realm
   * @param {IConfiguration | undefined } config - The Realm Configuration or undefined for first launch
   */
  constructor(config: IConfiguration | undefined) {
    REALM_INSTANCE = this
    this.config = config
    this.prepareDatabase()
    this.nextServer = this.createNextServer()
    this.expressApp = this.createExpressApplication()
    this.apolloServer = this.createApolloServer()
    this.requestHandler = this.nextServer.getRequestHandler()

    this.prepareSecureContext()

    this.configureNextRoutes()

    const httpServers = this.createHttpServers()
    this.httpServer = httpServers.httpServer
    this.httpsServer = httpServers.httpsServer

    this.startServer()
  }

  /** Update the https server to use a new certificate */
  public updateSecureContext(context: { key: string; cert: string }) {
    this.secureContext = createSecureContext(context)
  }

  // Shut down servers and update require cache
  public async stopServer() {
    this.httpsServer.close()
    this.httpServer.close()
    this.flushModules()

    await this.nextServer.close()
    delete this.config
    delete this.nextServer
    delete this.httpServer
    delete this.httpsServer
    delete this.expressApp
    delete this.apolloServer
    delete this.secureContext

    this.requireModules()
  }

  /** Remove 'next' modules from memory for a clean start */
  private flushModules() {
    NEXT_MODULES.forEach((moduleName) => decache(moduleName))
  }

  /** Load 'next' modules into memory for a clean start */
  private requireModules() {
    NEXT_MODULES.forEach((moduleName) => require(moduleName))
  }

  /** Create Express Application and connect middleware */
  private createExpressApplication(): ExpressApplication {
    const server = express()

    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json())

    // Use greenlock middleware for handling .well-known requests
    server.use(GreenlockMiddleware())

    // Require https for everything

    // Wire up authentication middlewares
    if (this.config && this.config.Security) {
      if (this.config.Server!.forceHttpsRedirect) {
        server.use('/', httpsRedirect(true))
      }
      server.use(cookieParser(this.config.Security!.globalSecret))

      // Set a NEEDS_FIRST_USER header if no user exists
      server.use(firstUserMiddleware)

      //
      server.use(getUserContext)

      server.use('/uploads', express.static(`${CONFIG_DIR}/uploads`))
    }

    return server
  }

  /** Configure routes for next server */
  private configureNextRoutes() {
    if (!this.config || !this.config.Security) {
      // Only allow OOBE, static, and _next routes
      this.expressApp.all('/oobe/?*|/static/*|/_next*', (req, res) => {
        return this.requestHandler(req, res)
      })

      this.expressApp.get('*', (req, res) => {
        res.redirect('/oobe')
      })
    } else {
      // this.ensureGrayskullClient()

      //disallow oobe
      this.expressApp.all('/oobe', (req, res) => {
        res.redirect('/')
      })

      // Connect route controllers
      const routeControllers = [new LoginController(this.nextServer), new UserController(this.nextServer), new OAuthController(this.nextServer)]
      routeControllers.forEach((c) => c.registerRoutes(this.expressApp))

      this.expressApp.get('*', (req, res) => {
        return this.requestHandler(req, res)
      })
    }
  }

  /** Load next middleware and create next server */
  private createNextServer(): any {
    const withCss = require('@zeit/next-css')
    const withSass = require('@zeit/next-sass')

    const NEXT_CONFIG = withSass(withCss())
    return next({ dev: IS_DEVELOPMENT, dir: './public', conf: NEXT_CONFIG })
  }

  private async prepareSecureContext() {
    await CertificateService.loadCertificateAndUpdateSecureContext()
  }

  /** Create the http and https servers */
  private createHttpServers(): { httpServer: HttpServer; httpsServer: HttpsServer } {
    const httpsServer = https.createServer(
      {
        SNICallback: (servername, cb) => {
          cb(null, this.secureContext)
        }
      },
      this.expressApp
    )
    const httpServer = http.createServer(this.expressApp)
    return { httpServer, httpsServer }
  }

  /** Start http and https servers */
  private async startServer() {
    this.httpServer.on('error', (err: Error) => {
      if (err) {
        throw err
      }
    })
    this.httpServer.listen(80, () => {
      console.log(`Grayskull http server is ready`)
    })

    this.httpsServer.on('error', (err: Error) => {
      if (err) {
        throw err
      }
    })
    this.httpsServer.listen(443, async () => {
      await this.nextServer.prepare()
      console.log(`Grayskull https server is ready`)
    })
  }

  /** Create an Apollo Server */
  private createApolloServer(): ApolloServer {
    const apollo = new ApolloServer({
      schema,
      playground: IS_DEVELOPMENT,
      introspection: IS_DEVELOPMENT,
      context: ({ req, res }) => {
        return { req, res, user: req.user }
      },
      uploads: {
        maxFileSize: 10000000,
        maxFiles: 10
      }
    })
    apollo.applyMiddleware({ app: this.expressApp, path: '/api/graphql' })
    return apollo
  }
  /**
   * Should connect to the database and ensure all tables are created
   */
  private async prepareDatabase() {
    await db.sequelize.sync().catch((err) => {
      console.error(err)
    })
  }
}
