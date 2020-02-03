// @ts-nocheck
import { default as Sequelize, Model } from 'sequelize'
export class EmailAddress extends Model {
  public emailAddressId: string = this.emailAddressId
  public userAccountId: string = this.userAccountId
  public emailAddress: string = this.emailAddress
  public verificationSecret: string = this.verificationSecret
  public verified: boolean = this.verified
  public primary: boolean = this.primary
  public createdBy: string | null = this.createdBy
  public createdAt: Date = this.createdAt
  public updatedBy: string | null = this.updatedBy
  public updatedAt: Date = this.updatedAt
  public deletedBy: string | null = this.deletedBy
  public deletedAt: Date | null = this.deletedAt
}

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
