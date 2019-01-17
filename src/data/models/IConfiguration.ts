import { ISecurityConfiguration } from './ISecurityConfiguration'
import { IMailConfiguration } from './IMailConfiguration'
import { IDatabaseConfiguration } from './IDatabaseConfiguration'
import { IServerConfiguration } from './IServerConfiguration'

export interface IConfiguration {
  Security?: ISecurityConfiguration
  Mail?: IMailConfiguration
  Database?: IDatabaseConfiguration
  Server?: IServerConfiguration
}
