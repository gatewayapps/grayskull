export interface ISession {
  sessionId?: string
  fingerprint: string
  userAccountId: string
  name?: string
  ipAddress: string
  lastUsedAt?: Date
  expiresAt: Date
  createdBy?: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
}
