import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IUserAccount } from './IUserAccount'

export type UserAccountInstance = Sequelize.Instance<IUserAccount> & IUserAccount

function UserAccountFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IUserAccount> = {
    userAccountId: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID
    },
    firstName: {
      type: Sequelize.STRING(30)
    },
    lastName: {
      type: Sequelize.STRING(30)
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
    otpEnabled: {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    isActive: {
      defaultValue: true,
      type: Sequelize.BOOLEAN
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
  return sequelize.define<UserAccountInstance, IUserAccount>('UserAccount', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default UserAccountFactory
