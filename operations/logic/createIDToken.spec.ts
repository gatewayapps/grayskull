import { createIDToken } from './createIDToken'
import { getInMemoryContext } from '../../foundation/context/getDataContext.spec'
import { verifyTokenForClient } from './verifyTokenForClient'

describe('createIDToken', () => {
	it('should correcetly return an IDToken', async () => {
		const userContext: any = {
			userAccountId: 'abc',
			createdAt: new Date(),
			emailAddress: 'test@test.com',
			emailAddressVerified: true,
			firstName: 'Test',
			lastName: 'User',
			lastActive: new Date(),
			isActive: true,
			permissions: 1
		}

		const userClient: any = {
			userAccountId: 'abc',
			allowedScopes: JSON.stringify(['profile', 'openid', 'email']),
			deniedScopes: JSON.stringify([]),
			createdAt: new Date(),
			createdBy: 'abc',
			userClientId: '123456',
			client_id: 'xyz'
		}

		const client: any = {
			client_id: 'xyz',
			secret: 'abcdefg',
			TokenSigningMethod: 'HS256'
		}
		const dataContext = await getInMemoryContext()
		const config: any = { Security: { accessTokenExpirationSeconds: 300 }, Server: { baseUrl: 'http://localhost' } }
		const idToken = await createIDToken(userContext, client, userClient, 'nonce', undefined, config, dataContext)
		expect(idToken).toBeDefined()
		if (idToken) {
			const decoded: any = await verifyTokenForClient(idToken, client, dataContext)
			expect(decoded).toBeDefined()
			expect(decoded).toHaveProperty('email')
			if (decoded && typeof decoded === 'object') {
				expect(decoded.email).toEqual('test@test.com')
			}
		}
	})
})
