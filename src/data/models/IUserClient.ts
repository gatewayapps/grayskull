export interface IUserClient {
  userAccountId: number
  client_id: string
  createdBy: number
  createdAt?: Date
  revoked?: boolean
  revokedBy?: number
  RevokedAt?: Date
}
