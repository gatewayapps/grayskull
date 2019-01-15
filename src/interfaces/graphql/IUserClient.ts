export interface IUserClientMeta {
  count: number
}

export interface IUserClientFilter {
  or?: [IUserClientFilter]
  and?: [IUserClientFilter]
  userAccountId_in?: [string]
  userAccountId_equals?: string
  userAccountId_notEquals?: string
  client_id_contains?: string
  client_id_startsWith?: string
  client_id_endsWith?: string
  client_id_equals?: string
  client_id_notEquals?: string
  revoked_equals?: boolean
  revoked_notEquals?: boolean
  revokedBy_in?: [string]
  revokedBy_equals?: string
  revokedBy_notEquals?: string
  RevokedAt_lessThan?: Date
  RevokedAt_greaterThan?: Date
  RevokedAt_equals?: Date
  RevokedAt_notEquals?: Date
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

export interface IUserClientUniqueFilter {
  userAccountId?: string
  client_id?: string
}
