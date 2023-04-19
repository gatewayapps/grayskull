import { initialMigration } from './initialMigration'
import { addClientAuthorizationFlowTypes } from './addClientAuthorizationFlowTypes'
import { userClientMetadata } from './userClientMetadata'
import { Migration } from '../types/Migration'
import { addTokenSigningMethodToClient } from './addTokenSigningMethodToClient'
import { settingsValueColumnLength } from './settingsValueColumnLength'

const migrations: Migration[] = [
	initialMigration,
	addClientAuthorizationFlowTypes,
	userClientMetadata,
	addTokenSigningMethodToClient,
	settingsValueColumnLength
]

export default migrations
