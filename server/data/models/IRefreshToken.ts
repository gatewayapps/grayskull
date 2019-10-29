export interface IRefreshToken {
  id?: string
  userClientId: string
  token: string
  issuedAt?: Date
  activeAt?: Date
  expiresAt?: Date | null
  revokedAt?: Date | null
  createdBy?: string | null
  updatedBy?: string | null
  revokedBy?: string | null
  deletedBy?: string | null
  deletedAt?: Date | null
}
