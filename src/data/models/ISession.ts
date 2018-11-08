export interface ISession {
  sessionId: string
  refreshToken: string
  createdAt?: Date
  lastUsedAt?: Date
}
