import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { cacheValue } from './cacheValue'
import { addSeconds } from 'date-fns'

describe('cacheValue', () => {
	it('Should store a string value with the correct expiration', async () => {
		const context = await getInMemoryContext()

		const TEST_KEY = 'TEST_KEY'
		const TEST_VALUE = 'TEST_VALUE'
		const TEST_EXPIRATION_SECONDS = 30

		await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)

		const kvc = await context.KeyValueCache.findOne({ where: { key: TEST_KEY } })
		expect(kvc).toBeDefined()

		const TEST_EXPIRATION = addSeconds(new Date(), TEST_EXPIRATION_SECONDS)

		if (kvc) {
			expect(kvc.expires.getTime()).toBeGreaterThan(new Date().getTime())
			expect(kvc.expires.getTime()).toBeLessThanOrEqual(TEST_EXPIRATION.getTime())
			expect(kvc.value).toEqual(TEST_VALUE)
		} else {
			expect(false).toEqual(true)
		}
	})
	it('Should correctly update a previously cached value with new value and expiration', async () => {
		const context = await getInMemoryContext()

		const TEST_KEY = 'TEST_KEY'
		const TEST_VALUE = 'TEST_VALUE'
		const TEST_EXPIRATION_SECONDS = -1

		await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)

		const TEST_VALUE_2 = 'TEST_VALUE_2'

		await cacheValue(TEST_KEY, TEST_VALUE_2, 30, context)

		const kvc = await context.KeyValueCache.findOne({ where: { key: TEST_KEY } })
		expect(kvc).toBeDefined()

		if (kvc) {
			expect(kvc.expires.getTime()).toBeGreaterThan(new Date().getTime())
			expect(kvc.value).toEqual(TEST_VALUE_2)
		} else {
			expect(false).toEqual(true)
		}
	})
})
