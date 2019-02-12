export interface IServerConfiguration {
  baseUrl: string
  realmName: string
  forceHttpsRedirect?: boolean
  enableCertbot?: boolean
  privateKey?: string | null
  certificate?: string | null
}
