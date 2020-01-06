// @ts-nocheck
import { default as Sequelize, Model } from 'sequelize'

export class Client extends Model {
  public client_id: string = this.client_id
  public name: string = this.name
  public logoImageUrl: string | null = this.logoImageUrl
  public description: string | null = this.description
  public secret: string = this.secret
  public baseUrl: string = this.baseUrl
  public pinToHeader: boolean | null = this.pinToHeader
  public homePageUrl: string | null = this.homePageUrl
  public redirectUris: string = this.redirectUris
  public scopes: string = this.scopes
  public public: boolean | null = this.public
  public isActive: boolean = this.isActive
  public createdBy: string | null = this.createdBy
  public createdAt: Date = this.createdAt
  public updatedBy: string | null = this.updatedBy
  public updatedAt: Date = this.updatedAt
  public deletedBy: string | null = this.deletedBy
  public deletedAt: Date | null = this.deletedAt
}

function ClientFactory(sequelize: Sequelize.Sequelize) {
  Client.init(
    {
      client_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      logoImageUrl: {
        allowNull: true,
        type: Sequelize.STRING
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING(500)
      },
      secret: {
        allowNull: false,
        type: Sequelize.STRING(500)
      },
      baseUrl: {
        allowNull: false,
        type: Sequelize.STRING
      },
      homePageUrl: {
        allowNull: true,
        type: Sequelize.STRING
      },
      redirectUris: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      scopes: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      pinToHeader: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      public: {
        allowNull: true,
        type: Sequelize.BOOLEAN
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
    {
      modelName: 'Client',
      sequelize,
      timestamps: true,
      paranoid: true
    }
  )
  return Client
}

export default ClientFactory
