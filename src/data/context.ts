import ConfigurationManager from '@/config/ConfigurationManager'
import Sequelize from 'sequelize'

import ClientFactory from './models/Client'
import EmailAddressFactory from './models/EmailAddress'
import UserAccountFactory from './models/UserAccount'
import UserClientFactory from './models/UserClient'
import SessionFactory from './models/Session'

const sequelize = new Sequelize(ConfigurationManager.General.databaseConnectionString)

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
