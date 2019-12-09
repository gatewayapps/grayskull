import Sequelize from 'sequelize'

import { Client } from './IClient'

function ClientFactory(sequelize: Sequelize.Sequelize) {
  Client.init(
    {
      client_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      name: {
        allowNull: false,
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
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      baseUrl: {
        allowNull: false,
        type: Sequelize.STRING
      },
      homePageUrl: {
        allowNull: true,
        type: Sequelize.STRING
      },
      redirectUris: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      scopes: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      public: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      isActive: {
        defaultValue: true,
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.UUID
      },
      createdAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.UUID
      },
      updatedAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
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
    },
    {
      modelName: 'Client',
      sequelize,
      timestamps: true,
      paranoid: true
    }
  )
  return Client
}

export default ClientFactory
