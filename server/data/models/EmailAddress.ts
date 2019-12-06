import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { EmailAddress } from './IEmailAddress'

function EmailAddressFactory(sequelize: Sequelize.Sequelize) {
  EmailAddress.init(
    {
      emailAddressId: {
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        type: Sequelize.UUID
      },
      userAccountId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      emailAddress: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      verificationSecret: {
        allowNull: false,
        type: Sequelize.STRING
      },
      verified: {
        defaultValue: false,
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      primary: {
        defaultValue: false,
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
    {
      modelName: 'EmailAddress',
      sequelize,
      timestamps: true,
      paranoid: true
    }
  )
  return EmailAddress
}

export default EmailAddressFactory
