import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IUserClient } from './IUserClient'

export type UserClientInstance = Sequelize.Instance<IUserClient> & IUserClient

function UserClientFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IUserClient> = {
    userAccountId: {
      unique: 'userClient',
      type: Sequelize.INTEGER
    },
    client_id: {
      unique: 'userClient',
      type: Sequelize.INTEGER
    },
    createdBy: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    revoked: {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    revokedBy: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    RevokedAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  }
  return sequelize.define<UserClientInstance, IUserClient>('UserClient', attributes)
}

export default UserClientFactory
