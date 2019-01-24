import Bluebird from 'bluebird'
import { IConfiguration } from '@data/models/IConfiguration'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser = require('cookie-parser')
import express, { Request, Response } from 'express'
import LoginController from './api/controllers/loginController'
import UserController from './api/controllers/userController'
import { pki } from 'node-forge'
import ConfigurationManager from './config/ConfigurationManager'
import { schema } from './data/graphql/graphql'

import { getUserContext } from './middleware/authentication'
import db from '@data/context'

import { default as https, Server } from 'https'
import next from 'next'
import { startServerInstance } from './main'

import ScopeService from '@services/ScopeService'
import UserAccountRepository from '@data/repositories/UserAccountRepository'
import ClientRepository from '@data/repositories/ClientRepository'

let FIRST_USER_CREATED: boolean = false

const NEXT_MODULES = ['next', 'webpack', 'tapable', '@zeit/next-css', '@zeit/next-sass', 'mini-css-extract-plugin']

const decache = require('decache')

let REALM_INSTANCE: RealmInstance

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
const HTTP_PORT = 80
const HTTPS_PORT = 443

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
    this.prepareDatabase().then(() => {
      if (!config) {
        this.configureOobeServer().then(() => {
          this.startServer()
        })
      } else {
        this.ensureGrayskullClient().then(() => {
          this.configureServer().then(() => {
            this.startServer()
          })
        })
      }
    })
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
  private generateTemporaryCertificate(): { key: string; cert: string } {
    const keys = pki.rsa.generateKeyPair(2048)
    const cert = pki.createCertificate()

    cert.publicKey = keys.publicKey
    cert.serialNumber = '01'
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)

    const attrs = []

    cert.setSubject(attrs)
    cert.setIssuer(attrs)

    cert.setExtensions([
      {
        name: 'basicConstraints',
        cA: true
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
      },
      {
        name: 'nsCertType',
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 6, // URI
            value: 'http://example.org/webid#me'
          },
          {
            type: 7, // IP
            ip: '127.0.0.1'
          }
        ]
      },
      {
        name: 'subjectKeyIdentifier'
      }
    ])

    cert.sign(keys.privateKey)
    const pemCertificate = pki.certificateToPem(cert)

    return { key: pki.privateKeyToPem(keys.privateKey), cert: pemCertificate }
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
    let httpsOptions: any
    if (!this.config) {
      httpsOptions = this.generateTemporaryCertificate()
      //we need to generate a temporary certificate for use in the config process
    } else {
      httpsOptions = {
        key: this.config.Server!.privateKey,
        cert: this.config.Server!.certificate
      }
    }

    this.httpServer = https.createServer(httpsOptions, this.server)

    this.httpServer.listen(HTTPS_PORT, (err: Error) => {
      if (err) {
        throw err
      }

      console.log(`Server ready at ${this.hostname}`)
    })
  }

  private async prepareDatabase() {
    // console.log('Initializing database connection')
    await db.sequelize.sync().catch((err) => {
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
      const userMeta = await UserAccountRepository.userAccountsMeta(null, { userContext: null })
      FIRST_USER_CREATED = userMeta.count > 0
    }
    res.locals['NEEDS_FIRST_USER'] = !FIRST_USER_CREATED

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
    const grayskullClient = await ClientRepository.getClient({ client_id: 'grayskull' }, { userContext: null })
    if (!grayskullClient) {
      await ClientRepository.createClient(
        {
          client_id: 'grayskull',
          name: ConfigurationManager.CurrentConfiguration!.Server!.realmName,
          secret: ConfigurationManager.CurrentConfiguration!.Security!.globalSecret,
          logoImageUrl: '/static/grayskull.gif',
          baseUrl: ConfigurationManager.CurrentConfiguration!.Server!.baseUrl,
          homePageUrl: `${ConfigurationManager.CurrentConfiguration!.Server!.baseUrl}/home`,
          redirectUris: JSON.stringify([`${ConfigurationManager.CurrentConfiguration!.Server!.baseUrl}/signin`]),
          scopes: JSON.stringify(ScopeService.getScopes().map((s) => s.id)),
          public: true
        },
        { userContext: null }
      )
    }
  }
}
