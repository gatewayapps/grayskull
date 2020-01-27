import { getInMemoryContext } from '../../../context/getDataContext.spec'

import { cacheValue } from './cacheValue'
import { getValue } from './getValue'

describe('getValue', () => {
  it('should correctly retrieve a value from cache', async () => {
    const context = await getInMemoryContext()

    const TEST_KEY = 'TEST_KEY'
    const TEST_VALUE = 'TEST_VALUE'
    const TEST_EXPIRATION_SECONDS = 30
    await cacheValue('BAD_KEY', '123', 30, context)
    await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)
    const kvc = await getValue(TEST_KEY, context)
    expect(kvc).toEqual(TEST_VALUE)
  })
  it('should not retrieve expired values from cache', async () => {
    const context = await getInMemoryContext()

    const TEST_KEY = 'TEST_KEY'
    const TEST_VALUE = 'TEST_VALUE'
    const TEST_EXPIRATION_SECONDS = -30

    await cacheValue(TEST_KEY, TEST_VALUE, TEST_EXPIRATION_SECONDS, context)
    const kvc = await getValue(TEST_KEY, context)
    expect(kvc).toBeUndefined()
  })
})
