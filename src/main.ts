import { RealmInstance } from './RealmInstance'
import { default as ConfigurationManager, loadConfigurationFromDisk } from './config/ConfigurationManager'

export function startServerInstance() {
  loadConfigurationFromDisk()
  const realm = new RealmInstance(ConfigurationManager.CurrentConfiguration)
}

startServerInstance()
