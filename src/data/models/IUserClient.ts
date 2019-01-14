export interface IUserClient {
  userAccountId: string
  client_id: string
  revoked?: boolean
  revokedBy?: string
  RevokedAt?: Date
  createdBy?: string
  createdAt?: Date
  updatedBy?: string
  updatedAt?: Date
  deletedBy?: string
  deletedAt?: Date
}
