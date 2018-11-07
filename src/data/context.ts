import ConfigurationManager from '@/config/ConfigurationManager'
import Sequelize from 'sequelize'

import UserAccountFactory from './models/UserAccount'
import ClientFactory from './models/Client'
import UserClientFactory from './models/UserClient'

const sequelize = new Sequelize(ConfigurationManager.General.databaseConnectionString)

const db = {
  sequelize,
  Sequelize,
  UserAccount: UserAccountFactory(sequelize),
  Client: ClientFactory(sequelize),
  UserClient: UserClientFactory(sequelize)
}

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db)
  }
})

export default db
