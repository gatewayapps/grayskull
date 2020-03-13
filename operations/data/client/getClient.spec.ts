import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { getClient } from './getClient'
import { createTestClient } from './createClient.spec'

describe('getClient', () => {
	it('Should correctly return a client', async () => {
		const context = await getInMemoryContext()
		const client = await createTestClient(context)
		const clientFromContext = await getClient(client!.client_id, context, true)
		expect(clientFromContext).toBeDefined()
	})
})
