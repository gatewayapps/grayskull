import { config } from 'dotenv'

import { ISecurityConfiguration } from '../data/models/ISecurityConfiguration'
import { IServerConfiguration } from '../data/models/IServerConfiguration'
import { IMailConfiguration } from '../data/models/IMailConfiguration'
import { IConfiguration } from '../data/models/IConfiguration'

config()
let currentConfig: IConfiguration
currentConfig = {}

export function getCurrentConfiguration(): IConfiguration {
  return currentConfig
}
class ConfigurationManager {
  public get CurrentConfiguration(): IConfiguration | undefined {
    return currentConfig
  }
  public get Security(): ISecurityConfiguration | undefined {
    if (currentConfig) {
      return currentConfig.Security
    } else {
      return undefined
    }
  }
  public get Server(): IServerConfiguration | undefined {
    if (currentConfig) {
      return currentConfig.Server
    } else {
      return undefined
    }
  }
  public get Mail(): IMailConfiguration | undefined {
    if (currentConfig) {
      return currentConfig.Mail
    } else {
      return undefined
    }
  }
}

export default new ConfigurationManager()
