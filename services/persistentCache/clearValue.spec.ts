import { getInMemoryContext } from '../../context/getDataContext.spec'

import { cacheValue } from './cacheValue'
import { clearValue } from './clearValue'

describe('clearValue', () => {
  it('Should correctly remove a value from the cache', async () => {
    const context = await getInMemoryContext()

    const TEST_KEY = 'TEST_KEY'
    const TEST_VALUE = 'TEST_VALUE'
    const TEST_EXPIRATION_SECONDS = 30

    await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)
    await cacheValue('EXTRA_KEY', TEST_VALUE, TEST_EXPIRATION_SECONDS, context)

    const kvc = await context.KeyValueCache.findOne({ where: { key: TEST_KEY } })
    expect(kvc).toBeDefined()

    await clearValue(TEST_KEY, context)
    const kvc2 = await context.KeyValueCache.findOne({ where: { key: TEST_KEY } })

    expect(kvc2).toBeNull()

    const valueCount = await context.KeyValueCache.count()
    expect(valueCount).toEqual(1)
  })
})
