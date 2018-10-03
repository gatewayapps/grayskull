import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IUserAccount } from './IUserAccount'

export type UserAccountInstance = Sequelize.Instance<IUserAccount> & IUserAccount

function UserAccountFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IUserAccount> = {
    dateCreated: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    emailAddress: {
      type: Sequelize.STRING
    },
    emailVerified: {
      type: Sequelize.BOOLEAN
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastActive: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    lastName: {
      type: Sequelize.STRING
    },
    lastPasswordChange: {
      type: Sequelize.DATE
    },
    password_hash: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    profileImageUrl: {
      type: Sequelize.STRING
    },
    userAccountId: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER
    }
  }
  return sequelize.define<UserAccountInstance, IUserAccount>('UserAccount', attributes)
}

export default UserAccountFactory
