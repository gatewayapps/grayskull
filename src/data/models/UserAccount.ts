import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IUserAccount } from './IUserAccount'

export type UserAccountInstance = Sequelize.Instance<IUserAccount> & IUserAccount

function UserAccountFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IUserAccount> = {
    userAccountId: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    emailAddress: {
      unique: true,
      type: Sequelize.STRING
    },
    emailVerified: {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    lastActive: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    lastPasswordChange: {
      type: Sequelize.DATE
    },
    passwordHash: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    },
    profileImageUrl: {
      type: Sequelize.STRING
    },
    permissions: {
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    otpSecret: {
      allowNull: true,
      type: Sequelize.STRING
    },
    isActive: {
      defaultValue: true,
      type: Sequelize.BOOLEAN
    },
    createdBy: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    createdAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    },
    modifiedBy: {
      allowNull: true,
      type: Sequelize.INTEGER
    },
    modifiedAt: {
      defaultValue: Sequelize.NOW,
      type: Sequelize.DATE
    }
  }
  return sequelize.define<UserAccountInstance, IUserAccount>('UserAccount', attributes)
}

export default UserAccountFactory
