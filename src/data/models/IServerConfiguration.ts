export interface IServerConfiguration {
  baseUrl: string
  realmName: string
  realmLogo: string
  forceHttpsRedirect?: boolean
  enableCertbot?: boolean
  privateKey?: string | null
  certificate?: string | null
}
