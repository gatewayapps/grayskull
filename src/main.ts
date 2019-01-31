import { RealmInstance } from './RealmInstance'
import { default as ConfigurationManager, loadConfigurationFromDisk } from './config/ConfigurationManager'
import { readFileSync } from 'fs'
const pem2jwk = require('pem-jwk').pem2jwk

export function startServerInstance() {
  loadConfigurationFromDisk()
  const realm = new RealmInstance(ConfigurationManager.CurrentConfiguration)
}

startServerInstance()
