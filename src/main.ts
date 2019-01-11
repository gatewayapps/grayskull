import { existsSync } from 'fs'
import { join } from 'path'
import { RealmInstance } from './RealmInstance'

const CONFIG_FILE_PATH = '/config/grayskull.config.js'

const realmConfig = existsSync(CONFIG_FILE_PATH) ? require(CONFIG_FILE_PATH) : undefined

const realm = new RealmInstance(realmConfig)
