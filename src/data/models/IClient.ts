export interface IClient {
  client_id: string
  name: string
  logoImageUrl?: string
  description?: string
  secret: string
  baseUrl: string
  homePageUrl?: string
  redirectUris: string
  public?: boolean
  isActive?: boolean
  createdBy?: number
  createdAt?: Date
  modifiedBy?: number
  modifiedAt?: Date
}
