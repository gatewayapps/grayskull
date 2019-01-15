export interface IUserClient {
  userClientId?: string
  userAccountId: string
  client_id: string
  allowedScopes: string
  deniedScopes: string
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
