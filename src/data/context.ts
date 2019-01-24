import ConfigurationManager from '@/config/ConfigurationManager'
import Sequelize from 'sequelize'

import ClientFactory from './models/Client'
import EmailAddressFactory from './models/EmailAddress'
import UserAccountFactory from './models/UserAccount'
import UserClientFactory from './models/UserClient'
import SessionFactory from './models/Session'

const SQLITE_PATH = `/usr/local/grayskull/meta.db`

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
  Session: SessionFactory(sequelize)
}

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db)
  }
})

export default db
