export interface IUserClient {
  userClientId?: string
  userAccountId: string
  client_id: string
  allowedScopes: string
  deniedScopes: string
  revoked?: boolean
  revokedBy?: string | null
  RevokedAt?: Date | null
  createdBy?: string | null
  createdAt?: Date
  updatedBy?: string | null
  updatedAt?: Date
  deletedBy?: string | null
  deletedAt?: Date | null
}
