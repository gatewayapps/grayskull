// @ts-nocheck
import { Model } from 'sequelize'
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
