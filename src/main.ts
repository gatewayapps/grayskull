import ConfigurationService from './api/services/ConfigurationService'
import { RealmInstance } from './RealmInstance'

export function startServerInstance() {
  const config = ConfigurationService.loadConfiguration()
  const realm = new RealmInstance(config)
}

startServerInstance()
