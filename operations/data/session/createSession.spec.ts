import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'

import { createSession } from './createSession'

import Knex from 'knex'
import { ISession } from '../../../foundation/types/types'

let dataContext: Knex

describe('createSession', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})

	it('Should correctly create a session', async () => {
		const sessionData: Partial<ISession> = {
			userAccountId: 'abc123',
			ipAddress: '1.1.1.1'
		}

		const createdSession = await createSession(sessionData, true, dataContext)
		expect(createdSession).toBeDefined()
		if (createdSession) {
			const sessionFromData = await dataContext<ISession>('Sessions')
				.where({ sessionId: createdSession.sessionId })
				.select('*')
				.first()

			expect(sessionFromData).toBeDefined()
			if (sessionFromData) {
				expect(sessionFromData.ipAddress).toEqual(sessionData.ipAddress)
				expect(sessionFromData.userAccountId).toEqual(sessionData.userAccountId)
			}
		}
	})
})
