export interface IUserAccountMeta {
  count: number
}

export interface IUserAccountFilter {
  or?: [IUserAccountFilter]
  and?: [IUserAccountFilter]
  userAccountId_lessThan?: number
  userAccountId_greaterThan?: number
  userAccountId_equals?: number
  userAccountId_notEquals?: number
  firstName_contains?: string
  firstName_startsWith?: string
  firstName_endsWith?: string
  firstName_equals?: string
  firstName_notEquals?: string
  lastName_contains?: string
  lastName_startsWith?: string
  lastName_endsWith?: string
  lastName_equals?: string
  lastName_notEquals?: string
  emailAddress_contains?: string
  emailAddress_startsWith?: string
  emailAddress_endsWith?: string
  emailAddress_equals?: string
  emailAddress_notEquals?: string
  emailVerified_equals?: boolean
  emailVerified_notEquals?: boolean
  lastActive_lessThan?: Date
  lastActive_greaterThan?: Date
  lastActive_equals?: Date
  lastActive_notEquals?: Date
  lastPasswordChange_lessThan?: Date
  lastPasswordChange_greaterThan?: Date
  lastPasswordChange_equals?: Date
  lastPasswordChange_notEquals?: Date
  phoneNumber_contains?: string
  phoneNumber_startsWith?: string
  phoneNumber_endsWith?: string
  phoneNumber_equals?: string
  phoneNumber_notEquals?: string
  profileImageUrl_contains?: string
  profileImageUrl_startsWith?: string
  profileImageUrl_endsWith?: string
  profileImageUrl_equals?: string
  profileImageUrl_notEquals?: string
  otpEnabled_equals?: boolean
  otpEnabled_notEquals?: boolean
  isActive_equals?: boolean
  isActive_notEquals?: boolean
  createdBy_lessThan?: number
  createdBy_greaterThan?: number
  createdBy_equals?: number
  createdBy_notEquals?: number
  createdAt_lessThan?: Date
  createdAt_greaterThan?: Date
  createdAt_equals?: Date
  createdAt_notEquals?: Date
  modifiedBy_lessThan?: number
  modifiedBy_greaterThan?: number
  modifiedBy_equals?: number
  modifiedBy_notEquals?: number
  modifiedAt_lessThan?: Date
  modifiedAt_greaterThan?: Date
  modifiedAt_equals?: Date
  modifiedAt_notEquals?: Date
}

export interface IUserAccountUniqueFilter {
  userAccountId?: number
  emailAddress?: string
}
