import Knex from 'knex'
import { ISession } from '../../../foundation/types/types'

export async function deleteSession(sessionId: string, dataContext: Knex) {
	await dataContext<ISession>('Sessions')
		.where({ sessionId })
		.delete()
}
