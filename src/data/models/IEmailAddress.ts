export interface IEmailAddress {
  emailAddressId?: string
  userAccountId: string
  emailAddress: string
  verificationSecret: string
  verified?: boolean
  primary?: boolean
  createdBy?: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}
