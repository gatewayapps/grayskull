export interface ISession {
  sessionId: string
  refreshToken: string
  lastUsedAt?: Date
  createdBy?: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}
