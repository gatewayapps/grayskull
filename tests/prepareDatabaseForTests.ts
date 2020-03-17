const BACKUP_CONTENT = require('./test_backup.txt').default
import { config } from 'dotenv'

config()

import { applyMigrations } from '../operations/data/migrations/applyMigrations'
import { getDataContextFromConnectionString } from '../foundation/context/getDataContext'

import { restore } from '../operations/data/backup/restore'

const TEST_CLIENT_ID = '94623896-a8f5-4e55-b955-9f12b53d0b32'
const TEST_CLIENT_SECRET = '0b2ced047f55fc2e080904b44b704e64114a7605cbf0423fb6ae0a73f4e528c1'

export async function prepareDatabaseForTests() {
	if (!process.env.GRAYSKULL_DB_CONNECTION_STRING) {
		throw new Error('You must set GRAYSKULL_DB_CONNECTION_STRING before running tests')
	}

	const dataContext = await getDataContextFromConnectionString(process.env.GRAYSKULL_DB_CONNECTION_STRING)
	await applyMigrations(dataContext)

	await restore(BACKUP_CONTENT, dataContext)
}
prepareDatabaseForTests()
