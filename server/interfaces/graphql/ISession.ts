export interface ISessionMeta {
  count: number
}

export interface ISessionFilter {
  or?: [ISessionFilter]
  and?: [ISessionFilter]
  sessionId_in?: [string]
  sessionId_equals?: string
  sessionId_notEquals?: string
  fingerprint_contains?: string
  fingerprint_startsWith?: string
  fingerprint_endsWith?: string
  fingerprint_equals?: string
  fingerprint_notEquals?: string
  userAccountId_in?: [string]
  userAccountId_equals?: string
  userAccountId_notEquals?: string
  name_contains?: string
  name_startsWith?: string
  name_endsWith?: string
  name_equals?: string
  name_notEquals?: string
  ipAddress_contains?: string
  ipAddress_startsWith?: string
  ipAddress_endsWith?: string
  ipAddress_equals?: string
  ipAddress_notEquals?: string
  lastUsedAt_lessThan?: Date
  lastUsedAt_greaterThan?: Date
  lastUsedAt_equals?: Date
  lastUsedAt_notEquals?: Date
  expiresAt_lessThan?: Date
  expiresAt_greaterThan?: Date
  expiresAt_equals?: Date
  expiresAt_notEquals?: Date
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
}

export interface ISessionUniqueFilter {
  sessionId?: string
}
