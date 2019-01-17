import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IClient } from './IClient'

export type ClientInstance = Sequelize.Instance<IClient> & IClient

function ClientFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IClient> = {
    client_id: {
      primaryKey: true,
      type: Sequelize.STRING(50)
    },
    name: {
      type: Sequelize.STRING(50)
    },
    logoImageUrl: {
      allowNull: true,
      type: Sequelize.STRING
    },
    description: {
      allowNull: true,
      type: Sequelize.STRING(500)
    },
    secret: {
      type: Sequelize.STRING(500)
    },
    baseUrl: {
      type: Sequelize.STRING
    },
    homePageUrl: {
      allowNull: true,
      type: Sequelize.STRING
    },
    redirectUris: {
      type: Sequelize.STRING(1000)
    },
    public: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    isActive: {
      defaultValue: true,
      type: Sequelize.BOOLEAN
    },
    createdBy: {
      allowNull: true,
      type: Sequelize.UUID
    },
    createdAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    updatedBy: {
      allowNull: true,
      type: Sequelize.UUID
    },
    updatedAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    deletedBy: {
      allowNull: true,
      type: Sequelize.UUID
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  }
  return sequelize.define<ClientInstance, IClient>('Client', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default ClientFactory
