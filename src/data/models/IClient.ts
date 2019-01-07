export interface IClient {
  client_id?: number
  name: string
  logoImageUrl?: string
  description?: string
  secret: string
  url: string
  public?: boolean
  redirectUri: string
  isActive?: boolean
  createdBy?: number
  createdAt?: Date
  modifiedBy?: number
  modifiedAt?: Date
}
