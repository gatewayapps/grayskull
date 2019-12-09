// @ts-nocheck
import { Model } from 'sequelize'
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
