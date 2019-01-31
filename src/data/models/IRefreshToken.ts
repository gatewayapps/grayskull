export interface IRefreshToken {
  id?: string
  userClientId: string
  token: string
  issuedAt?: Date
  activeAt?: Date
  expiresAt?: Date
  revokedAt?: Date
  createdBy?: string
  updatedBy?: string
  revokedBy?: string
  deletedBy?: string
  deletedAt?: Date
}
