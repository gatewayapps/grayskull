import { IClientRequestOptions } from '../../foundation/models/IClientRequestOptions'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { ScopeMap } from '../../foundation/constants/scopes'
import { ensureScope } from './ensureScope'
import { getClientRequestOptionsFromRequest } from './authentication'

jest.mock('./authentication', () => ({
	...(jest.requireActual('./authentication') as Record<string, unknown>),
	getClientRequestOptionsFromRequest: jest.fn().mockResolvedValue(undefined)
}))

const mockedGetClientRequestOptionsFromRequest = getClientRequestOptionsFromRequest as jest.MockedFunction<
	typeof getClientRequestOptionsFromRequest
>

describe('ensureScope', () => {
	let requestContext: IRequestContext
	let clientOptions: IClientRequestOptions

	beforeAll(() => {
		requestContext = {} as IRequestContext
		clientOptions = {} as IClientRequestOptions
	})

	beforeEach(() => {
		mockedGetClientRequestOptionsFromRequest.mockClear()
	})

	afterAll(() => {
		jest.clearAllMocks()
	})

	it('should return false if no client options exist', async () => {
		mockedGetClientRequestOptionsFromRequest.mockResolvedValueOnce(undefined)

		const scope = await ensureScope(ScopeMap.openid.id, requestContext)
		expect(scope).toEqual(false)
	})

	it('should return false if client options exist and scope is not included', async () => {
		clientOptions = { ...clientOptions, accessToken: { aud: '', exp: 0, sub: '', scopes: [] } }
		mockedGetClientRequestOptionsFromRequest.mockResolvedValueOnce(clientOptions)

		const scope = await ensureScope(ScopeMap.openid.id, requestContext)
		expect(scope).toEqual(false)
	})

	it('should return true if client options exist and scope is included', async () => {
		clientOptions = { ...clientOptions, accessToken: { aud: '', exp: 0, sub: '', scopes: [ScopeMap.openid.id] } }
		mockedGetClientRequestOptionsFromRequest.mockResolvedValueOnce(clientOptions)

		const scope = await ensureScope(ScopeMap.openid.id, requestContext)
		expect(scope).toEqual(true)
	})
})
