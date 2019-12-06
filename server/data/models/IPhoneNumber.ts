// @ts-nocheck
import { Model } from 'sequelize'
export class PhoneNumber extends Model {
  public phoneNumberId: string = this.phoneNumberId
  public userAccountId: string = this.userAccountId
  public phoneNumber: string = this.phoneNumber
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
