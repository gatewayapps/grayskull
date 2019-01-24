import Sequelize from 'sequelize'
import { IConfiguration } from '@data/models/IConfiguration'
import { existsSync, writeFileSync } from 'fs'
import ConfigurationManager from '@/config/ConfigurationManager'
import { ensureDirSync } from 'fs-extra'
import { join } from 'path'
import { RealmInstance } from '@/RealmInstance'
import { loadConfigurationFromDisk } from '@/config/ConfigurationManager'
import { randomBytes } from 'crypto'

const SECRET_LENGTH = 128

const CONFIG_DIR = '/usr/local/grayskull'
const CONFIG_FILENAME = 'grayskull.config.js'
const CONFIG_FILE_PATH = join(CONFIG_DIR, CONFIG_FILENAME)

export class ConfigurationService {
  public writeConfiguration(config: IConfiguration) {
    ensureDirSync(CONFIG_DIR)

    const currentConfig = ConfigurationManager.CurrentConfiguration
    if (currentConfig) {
      config.Security!.globalSecret = currentConfig.Security!.globalSecret
    } else {
      config.Security!.globalSecret = randomBytes(SECRET_LENGTH).toString('hex')
    }

    const fileContents = `module.exports = ${JSON.stringify(config, null, 2)}`
    writeFileSync(CONFIG_FILE_PATH, fileContents, 'utf8')

    loadConfigurationFromDisk()
    RealmInstance.restartServer()
  }
}

export default new ConfigurationService()
