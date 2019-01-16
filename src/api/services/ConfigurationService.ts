import ConfigurationServiceBase from '@services/ConfigurationServiceBase'
import { IDatabaseConfiguration } from '@data/models/IDatabaseConfiguration'
import Sequelize from 'sequelize'
import { IConfiguration } from '@data/models/IConfiguration'
import { existsSync, writeFileSync } from 'fs'
import { ensureDirSync } from 'fs-extra'
import { join } from 'path'

const CONFIG_DIR = '/usr/local/grayskull'
const CONFIG_FILENAME = '/usr/local/grayskull/grayskull.config.js'
const CONFIG_FILE_PATH = join(CONFIG_DIR, CONFIG_FILENAME)

class ConfigurationService extends ConfigurationServiceBase {
  public loadConfiguration(): IConfiguration | undefined {
    const realmConfig = existsSync(CONFIG_FILE_PATH) ? require(CONFIG_FILE_PATH) : undefined
    return realmConfig
  }

  public writeConfiguration(config: IConfiguration) {
    ensureDirSync(CONFIG_DIR)

    const fileContents = `module.exports = ${JSON.stringify(config, null, 2)}`
    writeFileSync(CONFIG_FILE_PATH, fileContents)
  }

  public async verifyDatabaseConnection(config: IDatabaseConfiguration): Promise<boolean> {
    const { databaseName, adminUsername, adminPassword, provider, serverAddress, serverPort } = config

    const sequelize = new Sequelize(databaseName, adminUsername, adminPassword, {
      port: serverPort,
      host: serverAddress,
      dialect: provider,
      dialectOptions: {
        poolIdleTimeout: 5000
      }
    })

    await sequelize.authenticate()
    return true
  }
}

export default new ConfigurationService()
