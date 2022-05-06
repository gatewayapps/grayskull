import { Migration } from '../types/Migration'
import { addClientAuthorizationFlowTypes } from './addClientAuthorizationFlowTypes'
import { addPropertiesToUserAccount } from './addPropertiesToUserAccount'
import { addTokenSigningMethodToClient } from './addTokenSigningMethodToClient'
import { initialMigration } from './initialMigration'
import { userClientMetadata } from './userClientMetadata'

const migrations: Migration[] = [
	initialMigration,
	addClientAuthorizationFlowTypes,
	userClientMetadata,
	addTokenSigningMethodToClient,
	addPropertiesToUserAccount
]

export default migrations
