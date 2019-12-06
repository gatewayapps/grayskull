// @ts-nocheck
import { Model } from 'sequelize'
export class UserClient extends Model {
  public userClientId: string = this.userClientId
  public userAccountId: string = this.userAccountId
  public client_id: string = this.client_id
  public allowedScopes: string = this.allowedScopes
  public deniedScopes: string = this.deniedScopes
  public revoked: boolean = this.revoked
  public revokedBy: string | null = this.revokedBy
  public RevokedAt: Date | null = this.RevokedAt
  public createdBy: string | null = this.createdBy
  public createdAt: Date = this.createdAt
  public updatedBy: string | null = this.updatedBy
  public updatedAt: Date = this.updatedAt
  public deletedBy: string | null = this.deletedBy
  public deletedAt: Date | null = this.deletedAt
}
