import ConfigurationManager from '@/config/ConfigurationManager'
import Sequelize from 'sequelize'
import ClientFactory from './models/Client'
import UserAccountFactory from './models/UserAccount'
import UserClientsFactory from './models/UserClients'

const sequelize = new Sequelize(ConfigurationManager.General.databaseConnectionString)

const db = {
  sequelize,
  Sequelize,
  UserAccount: UserAccountFactory(sequelize),
  Client: ClientFactory(sequelize),
  UserClients: UserClientsFactory(sequelize)
}

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db)
  }
})

export default db
