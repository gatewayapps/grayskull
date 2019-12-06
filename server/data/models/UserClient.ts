import { default as Sequelize, Model } from 'sequelize'

import { UserClient } from './IUserClient'

function UserClientFactory(sequelize: Sequelize.Sequelize) {
  UserClient.init(
    {
      userClientId: {
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        type: Sequelize.UUID
      },
      userAccountId: {
        unique: 'userClient',
        allowNull: false,
        type: Sequelize.UUID
      },
      client_id: {
        unique: 'userClient',
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      allowedScopes: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      deniedScopes: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      revoked: {
        defaultValue: false,
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      revokedBy: {
        allowNull: true,
        type: Sequelize.UUID
      },
      RevokedAt: {
        allowNull: true,
        type: Sequelize.DATE
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
      modelName: 'UserClient',
      timestamps: true,
      paranoid: true,
      sequelize
    }
  )
  return UserClient
}

export default UserClientFactory
