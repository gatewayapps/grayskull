import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IUserClient } from './IUserClient'

export type UserClientInstance = Sequelize.Instance<IUserClient> & IUserClient

function UserClientFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IUserClient> = {
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
    },
  }
  return sequelize.define<UserClientInstance, IUserClient>('UserClient', attributes, {
    timestamps: true,
    paranoid: true,
  })
}

export default UserClientFactory
