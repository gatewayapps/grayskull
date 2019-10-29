import ConfigurationManager from '@/config/ConfigurationManager'
import Sequelize from 'sequelize'
import { CONFIG_DIR } from '@/constants'

import ClientFactory from './models/Client'
import EmailAddressFactory from './models/EmailAddress'
import UserAccountFactory from './models/UserAccount'
import UserClientFactory from './models/UserClient'
import SessionFactory from './models/Session'
import RefreshTokenFactory from './models/RefreshToken'
import PhoneNumberFactory from './models/PhoneNumber'

const SQLITE_PATH = `${CONFIG_DIR}/meta.db`

const sequelize = new Sequelize('database', 'username', 'password', {
  // sqlite! now!
  dialect: 'sqlite',

  // the storage engine for sqlite
  // - default ':memory:'
  storage: SQLITE_PATH
})

const db = {
  sequelize,
  Sequelize,
  Client: ClientFactory(sequelize),
  EmailAddress: EmailAddressFactory(sequelize),
  UserAccount: UserAccountFactory(sequelize),
  UserClient: UserClientFactory(sequelize),
  Session: SessionFactory(sequelize),
  RefreshToken: RefreshTokenFactory(sequelize),
  PhoneNumber: PhoneNumberFactory(sequelize)
}

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db)
  }
})

export default db
