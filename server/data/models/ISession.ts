// @ts-nocheck
import { Model } from 'sequelize'
export class Session extends Model {
  public sessionId: string = this.sessionId
  public fingerprint: string = this.fingerprint
  public userAccountId: string = this.userAccountId
  public name: string | null = this.name
  public ipAddress: string = this.ipAddress
  public lastUsedAt: Date = this.lastUsedAt
  public expiresAt: Date = this.expiresAt
  public createdBy: string | null = this.createdBy
  public createdAt: Date = this.createdAt
  public updatedBy: string | null = this.updatedBy
  public updatedAt: Date = this.updatedAt
}
