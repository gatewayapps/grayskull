import { getInstance } from '@/RealmInstance'
import { ISecurityConfiguration } from '@data/models/ISecurityConfiguration'
import { IServerConfiguration } from '@data/models/IServerConfiguration'
import { IMailConfiguration } from '@data/models/IMailConfiguration'
import { join } from 'path'
import { existsSync } from 'fs'
import { IConfiguration } from '@data/models/IConfiguration'
import { CONFIG_DIR } from '@/constants'

const CONFIG_FILENAME = 'grayskull.config.js'
const CONFIG_FILE_PATH = join(CONFIG_DIR, CONFIG_FILENAME)

let currentConfig: IConfiguration

export function loadConfigurationFromDisk() {
  if (existsSync(CONFIG_FILE_PATH)) {
    currentConfig = require(CONFIG_FILE_PATH)
  }
}

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
loadConfigurationFromDisk()

export default new ConfigurationManager()
