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
      Sequelize: Sequelize.SequelizeStatic
      Client: Sequelize.Model<ClientInstance, IClient, IClient>
      EmailAddress: Sequelize.Model<EmailAddressInstance, IEmailAddress, IEmailAddress>
      UserAccount: Sequelize.Model<UserAccountInstance, IUserAccount, IUserAccount>
      UserClient: Sequelize.Model<UserClientInstance, IUserClient, IUserClient>
      Session: Sequelize.Model<SessionInstance, ISession, ISession>
      RefreshToken: Sequelize.Model<RefreshTokenInstance, IRefreshToken, IRefreshToken>
      PhoneNumber: Sequelize.Model<PhoneNumberInstance, IPhoneNumber, IPhoneNumber>
      Setting: Sequelize.Model<SettingInstance, ISetting, ISetting>
    }
  | undefined

function getSequelizeConnection() {
  if (process.env.GRAYSKULL_DB_CONNECTION_STRING) {
    return new Sequelize.Sequelize(process.env.GRAYSKULL_DB_CONNECTION_STRING)
  } else {
    let options: Sequelize.Options = {
      dialect: process.env.GRAYSKULL_DB_PROVIDER,
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

    return new Sequelize.Sequelize(process.env.GRAYSKULL_DB_HOST!, process.env.GRAYSKULL_DB_LOGIN!, process.env.GRAYSKULL_DB_PASSWORD!, options)
  }
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
