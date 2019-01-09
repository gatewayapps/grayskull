export interface IUserClientMeta {
  count: number
}

export interface IUserClientFilter {
  or?: [IUserClientFilter]
  and?: [IUserClientFilter]
  userAccountId_lessThan?: number
  userAccountId_greaterThan?: number
  userAccountId_equals?: number
  userAccountId_notEquals?: number
  client_id_in?: [string]
  client_id_equals?: string
  client_id_notEquals?: string
  createdBy_lessThan?: number
  createdBy_greaterThan?: number
  createdBy_equals?: number
  createdBy_notEquals?: number
  createdAt_lessThan?: Date
  createdAt_greaterThan?: Date
  createdAt_equals?: Date
  createdAt_notEquals?: Date
  revoked_equals?: boolean
  revoked_notEquals?: boolean
  revokedBy_lessThan?: number
  revokedBy_greaterThan?: number
  revokedBy_equals?: number
  revokedBy_notEquals?: number
  RevokedAt_lessThan?: Date
  RevokedAt_greaterThan?: Date
  RevokedAt_equals?: Date
  RevokedAt_notEquals?: Date
}

export interface IUserClientUniqueFilter {
  userAccountId?: number
  client_id?: string
}
