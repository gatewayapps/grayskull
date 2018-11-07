export interface IUserAccount {
  userAccountId?: number
  firstName: string
  lastName: string
  emailAddress: string
  emailVerified?: boolean
  lastActive?: Date
  lastPasswordChange: Date
  passwordHash: string
  phoneNumber: string
  profileImageUrl: string
  isActive?: boolean
  createdBy?: number
  createdAt?: Date
  modifiedBy?: number
  modifiedAt?: Date
}
