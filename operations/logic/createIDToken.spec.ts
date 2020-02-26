import { createIDToken } from "./createIDToken"
import jwt from 'jsonwebtoken'

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
      secret: 'abcdefg'
    }
    const config: any = { Security: { accessTokenExpirationSeconds: 300 }, Server: { baseUrl: 'http://localhost' } }
    const idToken = await createIDToken(userContext, client, userClient, 'nonce', undefined, config)
    expect(idToken).toBeDefined()
    if (idToken) {
      const decoded: any = jwt.verify(idToken, client.secret)
      expect(decoded).toBeDefined()
      expect(decoded).toHaveProperty('email')
      if (decoded && typeof decoded === 'object') {
        expect(decoded.email).toEqual('test@test.com')
      }
    }
  })
})
