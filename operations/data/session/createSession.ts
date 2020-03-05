import { addSeconds } from 'date-fns'

import { ISession } from '../../../foundation/types/types'
import { v4 as uuidv4 } from 'uuid'
import Knex from 'knex'

export const SESSION_EXPIRATION_SECONDS = 60 * 60

const EXTENDED_SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 365

export async function createSession(data: Partial<ISession>, extendedSession: boolean, dataContext: Knex) {
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

	await dataContext<ISession>('Sessions').insert(data)
	const sessionRecord = dataContext<ISession>('Sessions')
		.where({ sessionId: data.sessionId })
		.select('*')
		.first()

	if (sessionRecord) {
		return sessionRecord
	} else {
		throw new Error('Failed to create session in database')
	}
}
