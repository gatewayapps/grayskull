export interface IServerConfiguration {
  baseUrl: string
  realmName: string
  enableCertbot?: boolean
  privateKey?: string | null
  certificate?: string | null
}
