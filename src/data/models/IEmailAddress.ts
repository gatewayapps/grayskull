export interface IEmailAddress {
  emailAddressId?: string
  userAccountId: string
  emailAddress: string
  verificationSecret: string
  verified?: boolean
  primary?: boolean
  createdBy?: string | null
  createdAt?: Date
  updatedBy?: string | null
  updatedAt?: Date
  deletedBy?: string | null
  deletedAt?: Date | null
}
