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
    secret: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    },
    redirectUri: {
      type: Sequelize.STRING
    },
    isActive: {
      defaultValue: true,
      type: Sequelize.BOOLEAN
    },
    createdBy: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    createdAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    modifiedBy: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    modifiedAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    }
  }
  return sequelize.define<ClientInstance, IClient>('Client', attributes)
}

export default ClientFactory
