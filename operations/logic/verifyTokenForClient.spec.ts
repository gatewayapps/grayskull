import jwt from 'jsonwebtoken'
import { getInMemoryContext } from '../../foundation/context/getDataContext.spec'
import { IClient } from '../../foundation/types/types'
import { getRSAPublicKey } from '../data/configuration/getRSAPublicKey'
import { verifyTokenForClient } from './verifyTokenForClient'
import { createTestClient } from '../../operations/data/client/createClient.spec'

jest.mock('../data/configuration/getRSAPublicKey')
jest.mock('jsonwebtoken/verify')
const mockgetRSAPublicKey = getRSAPublicKey as jest.MockedFunction<typeof getRSAPublicKey>
const mockverifyToken = jwt.verify as jest.MockedFunction<
	(token: string, secretOrPublicKey: jwt.Secret, options?: jwt.VerifyOptions) => Record<string, unknown> | string
>

describe('verifyTokenForClient', () => {
	const decodedToken = {
		sub: '12345',
		aud: '12345',
		exp: 12345,
		iat: 12345
	}
	const token = 'SECRET_TOKEN_TEST'
	let testClient: IClient

	let dataContext
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
		testClient = await createTestClient(dataContext)
	})
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should throw a jwt.verify error if HS256 option is used but the jwt token is malformed', async () => {
		mockverifyToken.mockImplementation(() => {
			throw new Error('jwt malformed')
		})

		expect(verifyTokenForClient(token, testClient, dataContext)).rejects.toThrowError('jwt malformed')
	})

	it('should throw a jwt.verify error if RS256 option is used but the jwt token is malformed', async () => {
		const RS256TestClient = { ...testClient, TokenSigningMethod: 'RS256' }
		mockgetRSAPublicKey.mockResolvedValue('987654321_RSA_PUBLIC_KEY')
		mockverifyToken.mockImplementation(() => {
			throw new Error('jwt malformed')
		})

		expect(verifyTokenForClient(token, RS256TestClient, dataContext)).rejects.toThrowError('jwt malformed')
	})

	it('should return false when RS256 option is used but no RSA public key is set', async () => {
		const RS256TestClient = { ...testClient, TokenSigningMethod: 'RS256' }
		mockgetRSAPublicKey.mockResolvedValue(undefined)

		const verifiedToken = await verifyTokenForClient(token, RS256TestClient, dataContext)

		expect(verifiedToken).toBe(false)
	})

	it('should return the decoded HS256 jwt token when HS256 option is used', async () => {
		mockverifyToken.mockReturnValue(decodedToken)

		const verifiedToken = await verifyTokenForClient(token, testClient, dataContext)

		expect(verifiedToken).toEqual(decodedToken)
	})

	it('should return the decoded RS256 jwt token when RS256 option is used', async () => {
		const RS256TestClient = { ...testClient, TokenSigningMethod: 'RS256' }
		mockgetRSAPublicKey.mockResolvedValue('987654321_RSA_PUBLIC_KEY')
		mockverifyToken.mockReturnValue(decodedToken)

		const verifiedToken = await verifyTokenForClient(token, RS256TestClient, dataContext)

		expect(verifiedToken).toEqual(decodedToken)
	})
})
