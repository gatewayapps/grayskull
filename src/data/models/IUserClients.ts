export interface IUserClients {
  userAccountId: number
  client_id: number
  dateCreated?: Date
  dateRevoked?: Date
  createdBy: number
  revokedBy?: number
  revoked: boolean
}
