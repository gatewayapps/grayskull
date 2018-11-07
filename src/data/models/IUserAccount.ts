export interface IUserAccount {
  dateCreated?: Date
  emailAddress: string
  emailVerified: boolean
  firstName: string
  lastActive?: Date
  lastName: string
  lastPasswordChange: Date
  passwordHash: string
  phoneNumber: string
  profileImageUrl: string
  userAccountId?: number
  isActive?: boolean
}
