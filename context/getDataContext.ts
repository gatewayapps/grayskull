import Sequelize from 'sequelize'
import pg from 'pg'
import mysql2 from 'mysql2'

import { Client, default as ClientFactory } from '../server/data/models/Client'
import { EmailAddress, default as EmailAddressFactory } from '../server/data/models/EmailAddress'
import { UserAccount, default as UserAccountFactory } from '../server/data/models/UserAccount'
import { KeyValueCache, default as KeyValueCacheFactory } from '../server/data/models/KeyValueCache'
import { UserClient, default as UserClientFactory } from '../server/data/models/UserClient'
import { Session, default as SessionFactory } from '../server/data/models/Session'
import { RefreshToken, default as RefreshTokenFactory } from '../server/data/models/RefreshToken'
import { PhoneNumber, default as PhoneNumberFactory } from '../server/data/models/PhoneNumber'
import { Setting, default as SettingFactory } from '../server/data/models/Setting'

export interface DataContext {
  sequelize: Sequelize.Sequelize
  Client: Client
  EmailAddress: EmailAddress
  UserAccount: UserAccount
  KeyValueCache: KeyValueCache
  UserClient: UserClient
  Session: Session
  RefreshToken: RefreshToken
  PhoneNumber: PhoneNumber
  Setting: Setting
}

export async function getDataContext(options: Sequelize.Options): Promise<DataContext> {
  if (options.dialect === 'mssql') {
    options.dialectOptions = {
      options: {
        useUTC: false,
        dateFirst: 1
      }
    }
  }

  const sequelize = new Sequelize.Sequelize(options.database, options.username, options.password, options)
  await sequelize.sync()

  return {
    sequelize,
    UserAccount: UserAccountFactory(sequelize),
    Client: ClientFactory(sequelize),
    EmailAddress: EmailAddressFactory(sequelize),
    KeyValueCache: KeyValueCacheFactory(sequelize),
    UserClient: UserClientFactory(sequelize),
    Session: SessionFactory(sequelize),
    RefreshToken: RefreshTokenFactory(sequelize),
    PhoneNumber: PhoneNumberFactory(sequelize),
    Setting: SettingFactory(sequelize)
  }
}

export async function getDataContextFromConnectionString(connectionString: string): Promise<DataContext> {
  const connectionUrl = new URL(connectionString)
  let storage: string | undefined
  let dialectModule: any
  let dialect = connectionUrl.protocol.substr(0, connectionUrl.protocol.length - 1) as
    | 'mysql'
    | 'sqlite'
    | 'postgres'
    | 'mssql'
    | undefined
  switch (dialect?.toString()) {
    case 'mysql':
    case 'jdbc:mysql':
      dialect = 'mysql'
      dialectModule = mysql2
      break
    case 'sqlite':
      dialect = 'sqlite'
      storage = connectionUrl.pathname
      break
    case 'postgres':
      dialectModule = pg
      dialect = 'postgres'
      break
    case 'mssql':
    case 'jdbc:sqlserver':
      dialect = 'mssql'
      break
    default: {
      throw new Error('Unsupported dialect: ' + dialect)
    }
  }

  const user = connectionUrl.username
  const password = connectionUrl.password
  const server = connectionUrl.host
  const databaseName = connectionUrl.pathname.substr(1)
  return getDataContext({
    dialect: dialect!,
    logging: process.env.NODE_ENV !== 'production',
    username: user,
    password: password,
    host: server,
    dialectModule: dialectModule,
    database: databaseName,
    storage: storage
  })
}
