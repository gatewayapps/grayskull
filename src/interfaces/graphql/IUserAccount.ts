export interface IUserAccountMeta {
  count: number
}

export interface IUserAccountFilter {
  or?: [IUserAccountFilter]
  and?: [IUserAccountFilter]
  userAccountId_in?: [string]
  userAccountId_equals?: string
  userAccountId_notEquals?: string
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
  permissions_lessThan?: number
  permissions_greaterThan?: number
  permissions_equals?: number
  permissions_notEquals?: number
  otpEnabled_equals?: boolean
  otpEnabled_notEquals?: boolean
  isActive_equals?: boolean
  isActive_notEquals?: boolean
  createdBy_in?: [string]
  createdBy_equals?: string
  createdBy_notEquals?: string
  createdAt_lessThan?: Date
  createdAt_greaterThan?: Date
  createdAt_equals?: Date
  createdAt_notEquals?: Date
  updatedBy_in?: [string]
  updatedBy_equals?: string
  updatedBy_notEquals?: string
  updatedAt_lessThan?: Date
  updatedAt_greaterThan?: Date
  updatedAt_equals?: Date
  updatedAt_notEquals?: Date
  deletedBy_in?: [string]
  deletedBy_equals?: string
  deletedBy_notEquals?: string
  deletedAt_lessThan?: Date
  deletedAt_greaterThan?: Date
  deletedAt_equals?: Date
  deletedAt_notEquals?: Date
}

export interface IUserAccountUniqueFilter {
  userAccountId?: string
}
