export interface IUserAccount {
  userAccountId?: string
  firstName: string
  lastName: string
  lastActive?: Date
  lastPasswordChange: Date
  passwordHash: string
  phoneNumber: string
  profileImageUrl: string
  permissions?: number
  otpSecret?: string
  otpEnabled?: boolean
  isActive?: boolean
  createdBy?: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}
