// @ts-nocheck
import { default as Sequelize, Model } from 'sequelize'

export class RefreshToken extends Model {
  public id: string = this.id
  public userClientId: string = this.userClientId
  public token: string = this.token
  public issuedAt: Date = this.issuedAt
  public activeAt: Date = this.activeAt
  public expiresAt: Date | null = this.expiresAt
  public revokedAt: Date | null = this.revokedAt
  public createdBy: string | null = this.createdBy
  public updatedBy: string | null = this.updatedBy
  public revokedBy: string | null = this.revokedBy
  public deletedBy: string | null = this.deletedBy
  public deletedAt: Date | null = this.deletedAt
}

function RefreshTokenFactory(sequelize: Sequelize.Sequelize) {
  RefreshToken.init(
    {
      id: {
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        type: Sequelize.UUID
      },
      userClientId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      token: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      issuedAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      activeAt: {
        defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      expiresAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      revokedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.UUID
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.UUID
      },
      revokedBy: {
        allowNull: true,
        type: Sequelize.UUID
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
      modelName: 'RefreshToken',
      sequelize,
      timestamps: true,
      paranoid: true
    }
  )
  return RefreshToken
}

export default RefreshTokenFactory
