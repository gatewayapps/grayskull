import { addSeconds } from 'date-fns'
import { DataContext } from '../../../foundation/context/getDataContext'
import { ISession } from '../../../foundation/types/types'
import { v4 as uuidv4 } from 'uuid'

export const SESSION_EXPIRATION_SECONDS = 60 * 60

const EXTENDED_SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 365

export async function createSession(data: Partial<ISession>, extendedSession: boolean, dataContext: DataContext) {
	if (!data.userAccountId) {
		throw new Error('Session requires a userAccountId')
	}
	if (!data.ipAddress) {
		throw new Error('Session requires an ip address')
	}
	data.lastUsedAt = new Date()

	if (extendedSession) {
		data.expiresAt = addSeconds(new Date(), EXTENDED_SESSION_EXPIRATION_SECONDS)
	} else {
		data.expiresAt = addSeconds(new Date(), SESSION_EXPIRATION_SECONDS)
	}

	data.createdAt = new Date()
	data.updatedAt = new Date()
	data.sessionId = uuidv4()

	await dataContext.Session.insert(data)
	return dataContext.Session.where({ sessionId: data.sessionId })
		.select('*')
		.first()
}
