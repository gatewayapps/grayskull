import Knex from 'knex'
import { createClient } from './createClient'
import { IClient } from '../../../foundation/types/types'
import { UserContext } from '../../../foundation/context/getUserContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { v4 as uuidv4 } from 'uuid'
let context: Knex

export const TestClientDetails: IClient = {
	baseUrl: 'https://www.google.com',
	homePageUrl: 'https://www.google.com',
	redirectUris: JSON.stringify(['https://www.google.com/callback']),
	scopes: JSON.stringify(['email']),
	logoImageUrl: 'https://www.google.com/logo.png',
	name: 'Test Client',
	public: true,
	pinToHeader: true,
	isActive: true,
	client_id: uuidv4(),
	TokenSigningMethod: 'HS256'
} as any

export async function createTestClient(dataContext: Knex) {
	const testClient = await createClient(TestClientDetails, { userAccountId: 'abc123' } as UserContext, dataContext)
	if (!testClient) {
		throw new Error('Failed to create test client')
	}
	return testClient
}

describe('createClient', () => {
	beforeAll(async () => {
		context = await getInMemoryContext()
	})
	it('should create a client if provided the correct data', async () => {
		const client = await createTestClient(context)
		expect(client).toBeDefined()
		expect(client!.name).toEqual(TestClientDetails.name)
	})
})
