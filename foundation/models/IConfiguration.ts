import { ISecurityConfiguration } from './ISecurityConfiguration'

import { IMailConfiguration } from './IMailConfiguration'

import { IServerConfiguration } from './IServerConfiguration'

export interface IConfiguration {
	Security?: ISecurityConfiguration
	Mail?: IMailConfiguration
	Server?: IServerConfiguration
}
