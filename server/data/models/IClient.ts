// @ts-nocheck
import { Model } from 'sequelize'
export class Client extends Model {
  public client_id: string = this.client_id
  public name: string = this.name
  public logoImageUrl: string | null = this.logoImageUrl
  public description: string | null = this.description
  public secret: string = this.secret
  public baseUrl: string = this.baseUrl
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
