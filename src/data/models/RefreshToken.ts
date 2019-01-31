import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IRefreshToken } from './IRefreshToken'

export type RefreshTokenInstance = Sequelize.Instance<IRefreshToken> & IRefreshToken

function RefreshTokenFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IRefreshToken> = {
    id: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID
    },
    userClientId: {
      type: Sequelize.UUID
    },
    token: {
      type: Sequelize.STRING(500)
    },
    issuedAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    activeAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    expiresAt: {
      allowNull: true,
      type: Sequelize.DATE
    },
    revokedAt: {
      allowNull: true,
      type: Sequelize.DATE
    },
    createdBy: {
      allowNull: true,
      type: Sequelize.UUID
    },
    updatedBy: {
      allowNull: true,
      type: Sequelize.UUID
    },
    revokedBy: {
      allowNull: true,
      type: Sequelize.UUID
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
  return sequelize.define<RefreshTokenInstance, IRefreshToken>('RefreshToken', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default RefreshTokenFactory
