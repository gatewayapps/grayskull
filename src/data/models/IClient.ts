export interface IClient {
  client_id: string
  name: string
  logoImageUrl?: string
  description?: string
  secret: string
  baseUrl: string
  homePageUrl: string
  public?: boolean
  redirectUri: string
  isActive?: boolean
  createdBy?: number
  createdAt?: Date
  modifiedBy?: number
  modifiedAt?: Date
}
