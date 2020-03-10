import { initialMigration } from './initialMigration'
import { addClientAuthorizationFlowTypes } from './addClientAuthorizationFlowTypes'
import { Migration } from '../types/Migration'

const migrations: Migration[] = [initialMigration, addClientAuthorizationFlowTypes]

export default migrations
