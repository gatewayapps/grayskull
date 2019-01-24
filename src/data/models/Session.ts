import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { ISession } from './ISession'

export type SessionInstance = Sequelize.Instance<ISession> & ISession

function SessionFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<ISession> = {
    sessionId: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID
    },
    fingerprint: {
      type: Sequelize.STRING
    },
    userAccountId: {
      type: Sequelize.UUID
    },
    name: {
      allowNull: true,
      type: Sequelize.STRING(100)
    },
    ipAddress: {
      type: Sequelize.STRING(50)
    },
    lastUsedAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    expiresAt: {
      type: Sequelize.DATE(7)
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
    }
  }
  return sequelize.define<SessionInstance, ISession>('Session', attributes, {
    timestamps: true,
    paranoid: false
  })
}

export default SessionFactory
