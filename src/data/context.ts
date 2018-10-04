import config from 'config'
import Sequelize from 'sequelize'
import ClientFactory from './models/Client'
import UserAccountFactory from './models/UserAccount'
import UserClientsFactory from './models/UserClients'

const databaseConfig: any = config.get('Database')
const sequelize = new Sequelize(databaseConfig.connection)

const db = {
  sequelize,
  Sequelize,
  UserAccount: UserAccountFactory(sequelize),
  Client: ClientFactory(sequelize),
  UserClients: UserClientsFactory(sequelize),
}

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db)
  }
})

export default db
