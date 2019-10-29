export interface IClient {
  client_id: string
  name: string
  logoImageUrl?: string | null
  description?: string | null
  secret: string
  baseUrl: string
  homePageUrl?: string | null
  redirectUris: string
  scopes: string
  public?: boolean | null
  isActive?: boolean
  createdBy?: string | null
  createdAt?: Date
  updatedBy?: string | null
  updatedAt?: Date
  deletedBy?: string | null
  deletedAt?: Date | null
}
