import { decrypt } from '../../logic/encryption'
import Knex from 'knex'

async function bulkInsertHelper(record: any, tableName: string, dataContext: Knex) {
	return dataContext(tableName).insert(record)
}

export const restore = async (encryptedData: string, dataContext: Knex) => {
	const decrypted = decrypt(encryptedData)
	if (!decrypted || typeof decrypted !== 'string') {
		throw new Error('Failed to decrypt data')
	}

	const backup = JSON.parse(decrypted)

	// Clear out old data

	await dataContext('EmailAddresses').delete()
	await dataContext('UserClients').delete()
	await dataContext('Clients').delete()
	await dataContext('PhoneNumbers').delete()
	await dataContext('Sessions').delete()
	await dataContext('Settings').delete()
	await dataContext('KeyValueCache').delete()
	await dataContext('UserAccounts').delete()
	await dataContext('RefreshTokens').delete()

	await Promise.all(backup.userAccounts.map((ua) => bulkInsertHelper(ua, 'UserAccounts', dataContext)))
	await Promise.all(backup.emailAddresses.map((ua) => bulkInsertHelper(ua, 'EmailAddresses', dataContext)))
	await Promise.all(backup.settings.map((ua) => bulkInsertHelper(ua, 'Settings', dataContext)))
	await Promise.all(backup.clients.map((ua) => bulkInsertHelper(ua, 'Clients', dataContext)))
	await Promise.all(backup.phoneNumbers.map((ua) => bulkInsertHelper(ua, 'PhoneNumbers', dataContext)))
	await Promise.all(backup.userClients.map((ua) => bulkInsertHelper(ua, 'UserClients', dataContext)))
	await Promise.all(backup.refreshTokens.map((ua) => bulkInsertHelper(ua, 'RefreshTokens', dataContext)))
	await Promise.all(backup.sessions.map((ua) => bulkInsertHelper(ua, 'Sessions', dataContext)))
}
