export interface IUserAccount {
  userAccountId?: string
  firstName: string
  lastName: string
  lastActive?: Date
  lastPasswordChange: Date
  passwordHash: string
  phoneNumber?: string | null
  gender?: string | null
  birthday?: Date | null
  profileImageUrl?: string | null
  permissions?: number
  otpSecret?: string | null
  otpEnabled?: boolean
  resetPasswordToken?: string | null
  resetPasswordTokenExpiresAt?: Date | null
  isActive?: boolean
  createdBy?: string | null
  createdAt?: Date
  updatedBy?: string | null
  updatedAt?: Date
  deletedBy?: string | null
  deletedAt?: Date | null
}
