import Sequelize from 'sequelize'

import ClientFactory from './models/Client'
import EmailAddressFactory from './models/EmailAddress'
import UserAccountFactory from './models/UserAccount'
import UserClientFactory from './models/UserClient'
import SessionFactory from './models/Session'
import RefreshTokenFactory from './models/RefreshToken'
import PhoneNumberFactory from './models/PhoneNumber'
import SettingFactory from './models/Setting'

let dbInstance

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
