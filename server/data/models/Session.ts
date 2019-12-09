import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { Session } from './ISession'

function SessionFactory(sequelize: Sequelize.Sequelize) {
  Session.init(
    {
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
    },
    { modelName: 'Session', sequelize, timestamps: true, paranoid: false }
  )
  return Session
}

export default SessionFactory
