import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createSession } from './createSession'
import { deleteSession } from './deleteSession'
import Knex from 'knex'
import { ISession } from '../../../foundation/types/types'

let dataContext: Knex

describe('deleteSession', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})

	it('should delete a session from the dataContext', async () => {
		const sessionData: Partial<ISession> = {
			userAccountId: 'abc123',
			ipAddress: '1.1.1.1'
		}

		const createdSession = await createSession(sessionData, true, dataContext)

		expect(createdSession).toBeDefined()
		if (createdSession) {
			await deleteSession(createdSession.sessionId, dataContext)

			const sessionFromContext = await dataContext<ISession>('Sessions')
				.where({ sessionId: createdSession.sessionId })
				.select('*')
				.first()
			expect(sessionFromContext).toBeUndefined()
		}
	})
})
