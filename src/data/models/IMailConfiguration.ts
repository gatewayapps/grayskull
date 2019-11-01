export interface IMailConfiguration {
  serverAddress: string
  username: string
  password: string
  tlsSslRequired: boolean
  port: number
  fromAddress: string
}
