export interface ISession {
  sessionId?: string
  fingerprint: string
  userAccountId: string
  name?: string | null
  ipAddress: string
  lastUsedAt?: Date
  expiresAt: Date
  createdBy?: string | null
  createdAt?: Date
  updatedBy?: string | null
  updatedAt?: Date
}
