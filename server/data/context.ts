import { config } from 'dotenv'
if (config && typeof config === 'function') {
  config()
}

import Sequelize from 'sequelize'

import pg from 'pg'
import mysql2 from 'mysql2'
// import tedious from 'tedious'

import ClientFactory from './models/Client'
import EmailAddressFactory from './models/EmailAddress'
import UserAccountFactory from './models/UserAccount'
import UserClientFactory from './models/UserClient'
import SessionFactory from './models/Session'
import RefreshTokenFactory from './models/RefreshToken'
import PhoneNumberFactory from './models/PhoneNumber'
import SettingFactory from './models/Setting'
import KeyValueCacheFactory from './models/KeyValueCache'

let initialized = false

function getSequelizeConnection() {
  let user = process.env.GRAYSKULL_DB_LOGIN
  let password = process.env.GRAYSKULL_DB_PASSWORD
  let server = process.env.GRAYSKULL_DB_HOST
  let storage = process.env.GRAYSKULL_DB_STORAGE
  let dialectModule: any = undefined
  let dialect: 'mysql' | 'sqlite' | 'postgres' | 'mssql' | undefined = process.env.GRAYSKULL_DB_PROVIDER as
    | 'mysql'
    | 'sqlite'
    | 'postgres'
    | 'mssql'
    | undefined
  let databaseName = process.env.GRAYSKULL_DB_NAME

  if (process.env.GRAYSKULL_DB_CONNECTION_STRING) {
    const connectionUrl = new URL(process.env.GRAYSKULL_DB_CONNECTION_STRING)

    dialect = connectionUrl.protocol.substr(0, connectionUrl.protocol.length - 1) as
      | 'mysql'
      | 'sqlite'
      | 'postgres'
      | 'mssql'
      | undefined
    switch (dialect?.toString()) {
      case 'jdbc:mysql':
        dialect = 'mysql'
        break
      case 'sqlite':
        dialect = 'sqlite'
        storage = connectionUrl.pathname
        break
      case 'postgres':
        dialectModule = 'pg'
        dialect = 'postgres'
        break
      case 'jdbc:sqlserver':
        dialect = 'mssql'
        break
    }

    user = connectionUrl.username
    password = connectionUrl.password
    server = connectionUrl.host
    databaseName = connectionUrl.pathname.substr(1)
  }
  switch (dialect) {
    case 'mysql': {
      dialectModule = mysql2
      break
    }
    case 'postgres': {
      dialectModule = pg
      break
    }
  }

  let options: Sequelize.Options = {
    dialect: dialect!,
    logging: false,
    host: server,
    dialectModule: dialectModule,
    database: databaseName,
    storage: storage
  }

  if (options.dialect === 'mssql') {
    options.dialectOptions = {
      options: {
        useUTC: false,
        dateFirst: 1
      }
    }
  }

  return new Sequelize.Sequelize(databaseName!, user!, password!, options)
}

const sequelize = getSequelizeConnection()
const db = {
  sequelize,
  Sequelize,
  Client: ClientFactory(sequelize),
  EmailAddress: EmailAddressFactory(sequelize),
  UserAccount: UserAccountFactory(sequelize),
  KeyValueCache: KeyValueCacheFactory(sequelize),
  UserClient: UserClientFactory(sequelize),
  Session: SessionFactory(sequelize),
  RefreshToken: RefreshTokenFactory(sequelize),
  PhoneNumber: PhoneNumberFactory(sequelize),
  Setting: SettingFactory(sequelize)
}

// Object.values(db).forEach((model: any) => {
//   if (model.associate) {
//     model.associate(db)
//   }
// })

sequelize.sync()

export const getContext = async () => {
  if (!initialized) {
    try {
      await sequelize.sync()
      initialized = true
    } catch (err) {
      console.error(err)
    }
  }

  return db
}
