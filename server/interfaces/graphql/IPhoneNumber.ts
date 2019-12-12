export interface IPhoneNumberMeta {
  count: number
}

export interface IPhoneNumberFilter {
  or?: [IPhoneNumberFilter]
  and?: [IPhoneNumberFilter]
  phoneNumberId_in?: [string]
  phoneNumberId_equals?: string
  phoneNumberId_notEquals?: string
  userAccountId_in?: [string]
  userAccountId_equals?: string
  userAccountId_notEquals?: string
  phoneNumber_contains?: string
  phoneNumber_startsWith?: string
  phoneNumber_endsWith?: string
  phoneNumber_equals?: string
  phoneNumber_notEquals?: string
  verificationSecret_contains?: string
  verificationSecret_startsWith?: string
  verificationSecret_endsWith?: string
  verificationSecret_equals?: string
  verificationSecret_notEquals?: string
  verified_equals?: boolean
  verified_notEquals?: boolean
  primary_equals?: boolean
  primary_notEquals?: boolean
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

export interface IPhoneNumberUniqueFilter {
  phoneNumberId?: string
  phoneNumber?: string
}
