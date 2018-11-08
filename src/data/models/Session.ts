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
      type: Sequelize.STRING
    },
    createdAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    lastUsedAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    }
  }
  return sequelize.define<SessionInstance, ISession>('Session', attributes)
}

export default SessionFactory
