import { decrypt } from '../../logic/encryption'
import Knex from 'knex'
import { enforceDates } from '../../../foundation/context/getDataContext'

async function bulkInsertHelper(record: any, tableName: string, dataContext: Knex) {
	// When we drop a column from an existing table
	// we need to add a delete statement here for the restore process
	delete record.verificationSecret
	delete record.fingerprint

	if (tableName === 'Settings') {
		delete record.createdAt
		delete record.updatedAt
		delete record.deletedAt
	}

	if (tableName === 'Clients') {
		if (!record.TokenSigningMethod) {
			record.TokenSigningMethod = 'HS256'
		}
	}

	const sanitizedRecord = enforceDates(record)

	return dataContext(tableName).insert(sanitizedRecord)
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
