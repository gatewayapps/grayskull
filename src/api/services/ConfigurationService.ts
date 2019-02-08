import Sequelize from 'sequelize'
import { IConfiguration } from '@data/models/IConfiguration'
import { existsSync, writeFileSync } from 'fs'
import ConfigurationManager, { getCurrentConfiguration } from '@/config/ConfigurationManager'
import { ensureDirSync } from 'fs-extra'
import { join } from 'path'
import { RealmInstance, getInstance } from '@/RealmInstance'
import { loadConfigurationFromDisk } from '@/config/ConfigurationManager'
import { CONFIG_DIR } from '@/constants'
import { randomBytes } from 'crypto'

const SECRET_LENGTH = 128

const CONFIG_FILENAME = 'grayskull.config.js'
const CONFIG_FILE_PATH = join(CONFIG_DIR, CONFIG_FILENAME)

ensureDirSync(CONFIG_DIR)

export class ConfigurationService {
  public async writeConfiguration(config: IConfiguration) {
    const currentConfig = ConfigurationManager.CurrentConfiguration
    if (currentConfig) {
      config.Security!.globalSecret = currentConfig.Security!.globalSecret
    } else {
      config.Security!.globalSecret = randomBytes(SECRET_LENGTH).toString('hex')
    }

    const fileContents = `module.exports = ${JSON.stringify(config, null, 2)}`
    writeFileSync(CONFIG_FILE_PATH, fileContents, 'utf8')

    loadConfigurationFromDisk()
    await getInstance().stopServer()
    new RealmInstance(getCurrentConfiguration())
  }
}

export default new ConfigurationService()
