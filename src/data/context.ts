import ConfigurationManager from '@/config/ConfigurationManager'
import Sequelize from 'sequelize'

import ClientFactory from './models/Client'
import EmailAddressFactory from './models/EmailAddress'
import UserAccountFactory from './models/UserAccount'
import UserClientFactory from './models/UserClient'
import SessionFactory from './models/Session'
import ConfigurationFactory from './models/Configuration'

let db
export function initializeDatabase() {
  const config = ConfigurationManager.CurrentConfiguration
  if (config && config.Database) {
    const dbConfig = config.Database
    const { databaseName, adminUsername, adminPassword, provider, serverAddress, serverPort } = dbConfig!

    const sequelize = new Sequelize(databaseName, adminUsername, adminPassword, {
      port: serverPort,
      host: serverAddress,
      dialect: provider,
      dialectOptions: {
        poolIdleTimeout: 5000
      }
    })

    db = {
      sequelize,
      Sequelize,
      Client: ClientFactory(sequelize),
      EmailAddress: EmailAddressFactory(sequelize),
      UserAccount: UserAccountFactory(sequelize),
      UserClient: UserClientFactory(sequelize),
      Session: SessionFactory(sequelize),
      Configuration: ConfigurationFactory(sequelize)
    }

    Object.values(db).forEach((model: any) => {
      if (model.associate) {
        model.associate(db)
      }
    })
  }
}

initializeDatabase()

export function getContext() {
  return db
}

export default db
