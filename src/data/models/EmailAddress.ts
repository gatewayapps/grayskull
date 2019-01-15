import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IEmailAddress } from './IEmailAddress'

export type EmailAddressInstance = Sequelize.Instance<IEmailAddress> & IEmailAddress

function EmailAddressFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IEmailAddress> = {
    emailAddressId: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID
    },
    userAccountId: {
      type: Sequelize.UUID
    },
    emailAddress: {
      unique: true,
      type: Sequelize.STRING
    },
    verified: {
      defaultValue: false,
      type: Sequelize.BOOLEAN
    },
    primary: {
      defaultValue: false,
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
  return sequelize.define<EmailAddressInstance, IEmailAddress>('EmailAddress', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default EmailAddressFactory
