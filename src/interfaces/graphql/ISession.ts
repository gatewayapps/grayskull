export interface ISessionMeta {
  count: number
}

export interface ISessionFilter {
  or?: [ISessionFilter]
  and?: [ISessionFilter]
  sessionId_contains?: string
  sessionId_startsWith?: string
  sessionId_endsWith?: string
  sessionId_equals?: string
  sessionId_notEquals?: string
  refreshToken_contains?: string
  refreshToken_startsWith?: string
  refreshToken_endsWith?: string
  refreshToken_equals?: string
  refreshToken_notEquals?: string
  lastUsedAt_lessThan?: Date
  lastUsedAt_greaterThan?: Date
  lastUsedAt_equals?: Date
  lastUsedAt_notEquals?: Date
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

export interface ISessionUniqueFilter {
  sessionId?: string
}
