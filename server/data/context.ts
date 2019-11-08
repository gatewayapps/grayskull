import { config } from 'dotenv'
if (config && typeof config === 'function') {
  config()
}

import Sequelize from 'sequelize'

import ClientFactory, { ClientInstance } from './models/Client'
import EmailAddressFactory, { EmailAddressInstance } from './models/EmailAddress'
import UserAccountFactory, { UserAccountInstance } from './models/UserAccount'
import UserClientFactory, { UserClientInstance } from './models/UserClient'
import SessionFactory, { SessionInstance } from './models/Session'
import RefreshTokenFactory, { RefreshTokenInstance } from './models/RefreshToken'
import PhoneNumberFactory, { PhoneNumberInstance } from './models/PhoneNumber'
import SettingFactory, { SettingInstance } from './models/Setting'
import { IClient } from './models/IClient'
import { IEmailAddress } from './models/IEmailAddress'
import { IUserAccount } from './models/IUserAccount'
import { IUserClient } from './models/IUserClient'
import { ISession } from './models/ISession'
import { IRefreshToken } from './models/IRefreshToken'
import { IPhoneNumber } from './models/IPhoneNumber'
import { ISetting } from './models/ISetting'

let dbInstance:
  | {
      sequelize: Sequelize.Sequelize
      Sequelize: typeof Sequelize
      Client: Sequelize.Model<ClientInstance, IClient>
      EmailAddress: Sequelize.Model<EmailAddressInstance,  IEmailAddress>
      UserAccount: Sequelize.Model<UserAccountInstance, IUserAccount>
      UserClient: Sequelize.Model<UserClientInstance, IUserClient>
      Session: Sequelize.Model<SessionInstance, ISession>
      RefreshToken: Sequelize.Model<RefreshTokenInstance, IRefreshToken>
      PhoneNumber: Sequelize.Model<PhoneNumberInstance, IPhoneNumber>
      Setting: Sequelize.Model<SettingInstance, ISetting>
    }
  | undefined

function getSequelizeConnection() {
  let user = process.env.GRAYSKULL_DB_LOGIN
  let password = process.env.GRAYSKULL_DB_PASSWORD
  let server = process.env.GRAYSKULL_DB_HOST
  let dialect: 'mysql' | 'sqlite' | 'postgres' | 'mssql' | undefined = process.env.GRAYSKULL_DB_PROVIDER as 'mysql' | 'sqlite' | 'postgres' | 'mssql' | undefined
  let databaseName = process.env.GRAYSKULL_DB_NAME

  if (process.env.GRAYSKULL_DB_CONNECTION_STRING) {
    const connectionUrl = new URL(process.env.GRAYSKULL_DB_CONNECTION_STRING)
    dialect = connectionUrl.protocol.substr(0, connectionUrl.protocol.length - 1) as 'mysql' | 'sqlite' | 'postgres' | 'mssql' | undefined
    switch (dialect?.toString()) {
      case 'jdbc:mysql':
        dialect = 'mysql'
        break
      case 'sqlite':
        dialect = 'sqlite'
        break
      case 'postgres':
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
  let options: Sequelize.Options = {
    dialect: dialect!,
    host: server,
    database: databaseName,
    storage: process.env.GRAYSKULL_DB_STORAGE
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

export const getContext = async () => {
  if (!dbInstance) {
    const sequelize = getSequelizeConnection()
    const db = {
      sequelize,
      Sequelize,
      Client: ClientFactory(sequelize),
      EmailAddress: EmailAddressFactory(sequelize),
      UserAccount: UserAccountFactory(sequelize),
      UserClient: UserClientFactory(sequelize),
      Session: SessionFactory(sequelize),
      RefreshToken: RefreshTokenFactory(sequelize),
      PhoneNumber: PhoneNumberFactory(sequelize),
      Setting: SettingFactory(sequelize)
    }

    Object.values(db).forEach((model: any) => {
      if (model.associate) {
        model.associate(db)
      }
    })
    dbInstance = db
    await sequelize.sync()
  }
  return dbInstance
}

export default dbInstance
