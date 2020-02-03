import Sequelize from 'sequelize'
import pg from 'pg'
import mysql2 from 'mysql2'

import { Client, default as ClientFactory } from '../models/Client'
import { EmailAddress, default as EmailAddressFactory } from '../models/EmailAddress'
import { UserAccount, default as UserAccountFactory } from '../models/UserAccount'
import { KeyValueCache, default as KeyValueCacheFactory } from '../models/KeyValueCache'
import { UserClient, default as UserClientFactory } from '../models/UserClient'
import { Session, default as SessionFactory } from '../models/Session'
import { RefreshToken, default as RefreshTokenFactory } from '../models/RefreshToken'
import { PhoneNumber, default as PhoneNumberFactory } from '../models/PhoneNumber'
import { Setting, default as SettingFactory } from '../models/Setting'

export interface DataContext {
  sequelize: Sequelize.Sequelize
  Client: typeof Client
  EmailAddress: typeof EmailAddress
  UserAccount: typeof UserAccount
  KeyValueCache: typeof KeyValueCache
  UserClient: typeof UserClient
  Session: typeof Session
  RefreshToken: typeof RefreshToken
  PhoneNumber: typeof PhoneNumber
  Setting: typeof Setting
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

  if (!options.database) {
    throw new Error('You must provide a database name')
  }

  const sequelize = new Sequelize.Sequelize(options.database, options.username || 'username', options.password, options)

  const retVal = {
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
  try {
    const records = await sequelize.query(`SELECT * FROM Settings`)
    if (records[0].length === 0) {
      await retVal.sequelize.sync()
    }
  } catch {
    await retVal.sequelize.sync()
  }

  return retVal
}

export async function getDataContextFromConnectionString(connectionString: string): Promise<DataContext> {
  const connectionUrl = new URL(connectionString)
  let storage: string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dialectModule: any
  let dialect = connectionUrl.protocol.substr(0, connectionUrl.protocol.length - 1) as
    | 'mysql'
    | 'sqlite'
    | 'postgres'
    | 'mssql'
  switch (dialect.toString()) {
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
  }
  if (!dialect) {
    throw new Error('Unsupported dialect: ' + dialect)
  }

  const user = connectionUrl.username
  const password = connectionUrl.password
  const server = connectionUrl.host
  const databaseName = connectionUrl.pathname.substr(1)
  return getDataContext({
    dialect: dialect,
    username: user,
    logging: false,
    password: password,
    host: server,
    dialectModule: dialectModule,
    database: databaseName,
    storage: storage
  })
}
