import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { ISession } from './ISession'

export type SessionInstance = Sequelize.Instance<ISession> & ISession

function SessionFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<ISession> = {
    sessionId: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      type: Sequelize.UUID
    },
    fingerprint: {
      allowNull: false,
      type: Sequelize.STRING
    },
    userAccountId: {
      allowNull: false,
      type: Sequelize.UUID
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING(100)
    },
    ipAddress: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    lastUsedAt: {
      defaultValue: Sequelize.NOW,
      allowNull: false,
      type: Sequelize.DATE
    },
    expiresAt: {
      allowNull: false,
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
    }
  }
  return sequelize.define<SessionInstance, ISession>('Session', attributes, {
    timestamps: true,
    paranoid: false
  })
}

export default SessionFactory
