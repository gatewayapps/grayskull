import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createClient } from './createClient'
import { IClient } from '../../../foundation/types/types'
import { v4 as uuidv4 } from 'uuid'
import { UserContext } from '../../../foundation/context/getUserContext'
import { getClient } from './getClient'

const testClient: IClient = {
	baseUrl: 'https://www.google.com',
	homePageUrl: 'https://www.google.com',
	redirectUris: JSON.stringify(['https://www.google.com/callback']),
	scopes: JSON.stringify(['email']),
	logoImageUrl: 'https://www.google.com/logo.png',
	name: 'Test Client',
	public: true,
	pinToHeader: true,
	isActive: true,
	client_id: uuidv4()
} as any

describe('getClient', () => {
	it('Should correctly return a client', async () => {
		const context = await getInMemoryContext()
		await createClient(testClient, { userAccountId: 'abc123' } as UserContext, context)
		const clientFromContext = await getClient(testClient.client_id, context, true)
		expect(clientFromContext).toBeDefined()
	})
})
