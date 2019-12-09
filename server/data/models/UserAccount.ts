import Sequelize from 'sequelize'
import { UserAccount } from './IUserAccount'

function UserAccountFactory(sequelize: Sequelize.Sequelize) {
  UserAccount.init(
    {
      userAccountId: {
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        type: Sequelize.UUID
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(30)
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(30)
      },
      displayName: {
        allowNull: true,
        type: Sequelize.STRING(30)
      },
      lastActive: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      lastPasswordChange: {
        allowNull: false,
        type: Sequelize.DATE
      },
      passwordHash: {
        allowNull: false,
        type: Sequelize.STRING
      },
      gender: {
        allowNull: true,
        type: Sequelize.STRING
      },
      birthday: {
        allowNull: true,
        type: Sequelize.DATE
      },
      profileImageUrl: {
        allowNull: true,
        type: Sequelize.STRING
      },
      permissions: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.INTEGER
      },
      otpSecret: {
        allowNull: true,
        type: Sequelize.STRING
      },
      otpEnabled: {
        defaultValue: false,
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      resetPasswordToken: {
        allowNull: true,
        type: Sequelize.STRING
      },
      resetPasswordTokenExpiresAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      isActive: {
        defaultValue: true,
        allowNull: false,
        type: Sequelize.BOOLEAN
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
      },
      deletedBy: {
        allowNull: true,
        type: Sequelize.UUID
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    },
    { sequelize, timestamps: true, paranoid: true, modelName: 'UserAccount' }
  )
  return UserAccount
}

export default UserAccountFactory
