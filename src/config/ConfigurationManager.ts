import config from 'config'
import { IGeneralOptions } from './IGeneralOptions'
import { ISecurityOptions } from './ISecurityOptions'

class ConfigurationManager {
  public get Security(): ISecurityOptions {
    return config.get('Security')
  }
  public get General(): IGeneralOptions {
    return config.get('General')
  }
  public get Mail(): IGeneralOptions {
    return config.get('Mail')
  }
}

export default new ConfigurationManager()
