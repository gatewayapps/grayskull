import { initialMigration } from './initialMigration'
import { addClientAuthorizationFlowTypes } from './addClientAuthorizationFlowTypes'
import { userClientMetadata } from './userClientMetadata'
import { Migration } from '../types/Migration'

const migrations: Migration[] = [initialMigration, addClientAuthorizationFlowTypes, userClientMetadata]

export default migrations
