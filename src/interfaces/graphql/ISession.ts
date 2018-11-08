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
  createdAt_lessThan?: Date
  createdAt_greaterThan?: Date
  createdAt_equals?: Date
  createdAt_notEquals?: Date
  lastUsedAt_lessThan?: Date
  lastUsedAt_greaterThan?: Date
  lastUsedAt_equals?: Date
  lastUsedAt_notEquals?: Date
}

export interface ISessionUniqueFilter {
  sessionId?: string
}
