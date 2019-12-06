// @ts-nocheck
import { Model } from 'sequelize'
export class UserAccount extends Model {
  public userAccountId: string = this.userAccountId
  public firstName: string = this.firstName
  public lastName: string = this.lastName
  public displayName: string | null = this.displayName
  public lastActive: Date = this.lastActive
  public lastPasswordChange: Date = this.lastPasswordChange
  public passwordHash: string = this.passwordHash
  public gender: string | null = this.gender
  public birthday: Date | null = this.birthday
  public profileImageUrl: string | null = this.profileImageUrl
  public permissions: number = this.permissions
  public otpSecret: string | null = this.otpSecret
  public otpEnabled: boolean = this.otpEnabled
  public resetPasswordToken: string | null = this.resetPasswordToken
  public resetPasswordTokenExpiresAt: Date | null = this.resetPasswordTokenExpiresAt
  public isActive: boolean = this.isActive
  public createdBy: string | null = this.createdBy
  public createdAt: Date = this.createdAt
  public updatedBy: string | null = this.updatedBy
  public updatedAt: Date = this.updatedAt
  public deletedBy: string | null = this.deletedBy
  public deletedAt: Date | null = this.deletedAt
}
