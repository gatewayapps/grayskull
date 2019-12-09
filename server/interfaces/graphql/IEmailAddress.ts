export interface IEmailAddressMeta {
  count: number
}

export interface IEmailAddressFilter {
  or?: [IEmailAddressFilter]
  and?: [IEmailAddressFilter]
  emailAddressId_in?: [ string ]
  emailAddressId_equals?: string
  emailAddressId_notEquals?: string
  userAccountId_in?: [ string ]
  userAccountId_equals?: string
  userAccountId_notEquals?: string
  emailAddress_contains?: string
  emailAddress_startsWith?: string
  emailAddress_endsWith?: string
  emailAddress_equals?: string
  emailAddress_notEquals?: string
  verificationSecret_contains?: string
  verificationSecret_startsWith?: string
  verificationSecret_endsWith?: string
  verificationSecret_equals?: string
  verificationSecret_notEquals?: string
  verified_equals?: boolean
  verified_notEquals?: boolean
  primary_equals?: boolean
  primary_notEquals?: boolean
  createdBy_in?: [ string ]
  createdBy_equals?: string
  createdBy_notEquals?: string
  createdAt_lessThan?: Date
  createdAt_greaterThan?: Date
  createdAt_equals?: Date
  createdAt_notEquals?: Date
  updatedBy_in?: [ string ]
  updatedBy_equals?: string
  updatedBy_notEquals?: string
  updatedAt_lessThan?: Date
  updatedAt_greaterThan?: Date
  updatedAt_equals?: Date
  updatedAt_notEquals?: Date
  deletedBy_in?: [ string ]
  deletedBy_equals?: string
  deletedBy_notEquals?: string
  deletedAt_lessThan?: Date
  deletedAt_greaterThan?: Date
  deletedAt_equals?: Date
  deletedAt_notEquals?: Date
}

export interface IEmailAddressUniqueFilter {
  emailAddressId?: string
    emailAddress?: string
}
