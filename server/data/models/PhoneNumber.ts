import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../../types/SequelizeAttributes'
import { IPhoneNumber } from './IPhoneNumber'

export type PhoneNumberInstance = Sequelize.Instance<IPhoneNumber> & IPhoneNumber

function PhoneNumberFactory(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<IPhoneNumber> = {
    phoneNumberId: {
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      type: Sequelize.UUID
    },
    userAccountId: {
      allowNull: false,
      type: Sequelize.UUID
    },
    phoneNumber: {
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
  }
  return sequelize.define<PhoneNumberInstance, IPhoneNumber>('PhoneNumber', attributes, {
    timestamps: true,
    paranoid: true
  })
}

export default PhoneNumberFactory
