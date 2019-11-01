export interface IRefreshTokenMeta {
  count: number
}

export interface IRefreshTokenFilter {
  or?: [IRefreshTokenFilter]
  and?: [IRefreshTokenFilter]
  id_in?: [ string ]
  id_equals?: string
  id_notEquals?: string
  userClientId_in?: [ string ]
  userClientId_equals?: string
  userClientId_notEquals?: string
  token_contains?: string
  token_startsWith?: string
  token_endsWith?: string
  token_equals?: string
  token_notEquals?: string
  issuedAt_lessThan?: Date
  issuedAt_greaterThan?: Date
  issuedAt_equals?: Date
  issuedAt_notEquals?: Date
  activeAt_lessThan?: Date
  activeAt_greaterThan?: Date
  activeAt_equals?: Date
  activeAt_notEquals?: Date
  expiresAt_lessThan?: Date
  expiresAt_greaterThan?: Date
  expiresAt_equals?: Date
  expiresAt_notEquals?: Date
  revokedAt_lessThan?: Date
  revokedAt_greaterThan?: Date
  revokedAt_equals?: Date
  revokedAt_notEquals?: Date
  createdBy_in?: [ string ]
  createdBy_equals?: string
  createdBy_notEquals?: string
  updatedBy_in?: [ string ]
  updatedBy_equals?: string
  updatedBy_notEquals?: string
  revokedBy_in?: [ string ]
  revokedBy_equals?: string
  revokedBy_notEquals?: string
  deletedBy_in?: [ string ]
  deletedBy_equals?: string
  deletedBy_notEquals?: string
  deletedAt_lessThan?: Date
  deletedAt_greaterThan?: Date
  deletedAt_equals?: Date
  deletedAt_notEquals?: Date
}

export interface IRefreshTokenUniqueFilter {
  id?: string
    token?: string
}
