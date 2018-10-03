export interface IUserClients {
  userAccountId: number
  clientId: number
  dateCreated?: Date
  dateRevoked?: Date
  createdBy: number
  revokedBy?: number
  revoked: boolean
}
