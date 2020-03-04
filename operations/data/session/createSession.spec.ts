import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'

import { createSession } from './createSession'
import { Session } from '../../../foundation/models/Session'

let dataContext: DataContext

describe('createSession', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})

	it('Should correctly create a session', async () => {
		const sessionData: Partial<Session> = {
			userAccountId: 'abc123',
			ipAddress: '1.1.1.1'
		}

		const createdSession = await createSession(sessionData, true, dataContext)
		expect(createdSession).toBeDefined()

		const sessionFromData = await dataContext.Session.findOne({ where: { sessionId: createdSession.sessionId } })

		expect(sessionFromData).toBeDefined()
		if (sessionFromData) {
			expect(sessionFromData.ipAddress).toEqual(sessionData.ipAddress)
			expect(sessionFromData.userAccountId).toEqual(sessionData.userAccountId)
		}
	})
})
