import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IClient } from './IClient'

export type ClientInstance = Sequelize.Instance<IClient> & IClient

function ClientFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IClient> = {
    client_id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    logoImageUrl: {
      allowNull: true,
      type: Sequelize.STRING
    },
    description: {
      allowNull: true,
      type: Sequelize.STRING
    },
    url: {
      allowNull: true,
      type: Sequelize.STRING
    },
    secret: {
      allowNull: true,
      type: Sequelize.STRING
    }
  }
  return sequelize.define<ClientInstance, IClient>('Client', attributes)
}

export default ClientFactory
