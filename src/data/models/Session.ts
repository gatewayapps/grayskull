import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { ISession } from './ISession'

export type SessionInstance = Sequelize.Instance<ISession> & ISession

function SessionFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<ISession> = {
    sessionId: {
      primaryKey: true,
      type: Sequelize.STRING
    },
    refreshToken: {
      type: Sequelize.STRING(1000)
    },
    lastUsedAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
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
  return sequelize.define<SessionInstance, ISession>('Session', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default SessionFactory
