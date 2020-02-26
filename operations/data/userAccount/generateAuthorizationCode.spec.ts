import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { generateAuthorizationCode } from './generateAuthorizationCode'
import { getValue } from '../persistentCache/getValue'

let dataContext: DataContext
describe('generateAuthorizationCode', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})
	it('Should return a code', async () => {
		const code = await generateAuthorizationCode('test', [], '123', '456', {} as any, dataContext)
		expect(code).toBeDefined()
		expect(typeof code).toEqual('string')
		expect(code.length).toBeGreaterThan(0)
	})
	it('should encode the correct data properties', async () => {
		const code = await generateAuthorizationCode('test', [], '123', '456', {} as any, dataContext)
		const cachedValue = await getValue(code, dataContext)
		expect(cachedValue).toBeDefined()
		if (cachedValue) {
			const parsed = JSON.parse(cachedValue)
			expect(parsed).toBeDefined()
			if (parsed) {
				expect(parsed.clientId).toEqual('test')
				expect(parsed.scope).toBeDefined()
				expect(parsed.userAccount).toBeDefined()
				expect(parsed.userClientId).toBeDefined()
				expect(parsed.nonce).toBeDefined()
			}
		}
	})
})
