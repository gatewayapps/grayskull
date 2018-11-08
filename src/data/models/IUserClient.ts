export interface IUserClient {
  userAccountId: number
  client_id: number
  createdBy: number
  createdAt?: Date
  revoked?: boolean
  revokedBy?: number
  RevokedAt?: Date
}
