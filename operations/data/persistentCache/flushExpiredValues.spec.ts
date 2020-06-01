import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'

import { cacheValue } from './cacheValue'
import { flushExpiredValues } from './flushExpiredValues'
import { getRecord } from './getValue'

describe('flushExpiredValues', () => {
	it('Should correctly remove expired values from the cache', async () => {
		const context = await getInMemoryContext()

		const TEST_KEY = 'TEST_KEY'
		const TEST_VALUE = 'TEST_VALUE'
		const TEST_EXPIRATION_SECONDS = -30

		await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)
		const kvc = await getRecord(TEST_KEY, context)
		expect(kvc).toBeUndefined()
	})

	it('Should not remove values that are still valid', async () => {
		const context = await getInMemoryContext()

		const TEST_KEY = 'TEST_KEY'
		const TEST_VALUE = 'TEST_VALUE'
		const TEST_EXPIRATION_SECONDS = 30

		await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)
		await flushExpiredValues(context)

		const kvc = await getRecord(TEST_KEY, context)
		expect(kvc).toBeDefined()
	})
})
