import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'

import { cacheValue } from './cacheValue'
import { flushExpiredValues } from './flushExpiredValues'

describe('flushExpiredValues', () => {
  it('Should correctly remove expired values from the cache', async () => {
    const context = await getInMemoryContext()

    const TEST_KEY = 'TEST_KEY'
    const TEST_VALUE = 'TEST_VALUE'
    const TEST_EXPIRATION_SECONDS = -30

    await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)
    const kvc = await context.KeyValueCache.findOne({ where: { key: TEST_KEY } })
    expect(kvc).toBeDefined()

    await flushExpiredValues(context)

    const kvc2 = await context.KeyValueCache.findOne({ where: { key: TEST_KEY } })
    expect(kvc2).toBeNull()
  })

  it('Should not remove values that are still valid', async () => {
    const context = await getInMemoryContext()

    const TEST_KEY = 'TEST_KEY'
    const TEST_VALUE = 'TEST_VALUE'
    const TEST_EXPIRATION_SECONDS = 30

    await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)
    await flushExpiredValues(context)

    const kvc = await context.KeyValueCache.findOne({ where: { key: TEST_KEY } })
    expect(kvc).toBeDefined()
  })
})
