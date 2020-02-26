import { getCacheContext } from './getCacheContext'

describe('getCacheContext', () => {
	it('should correctly set a cache entry', () => {
		const cacheContext = getCacheContext()
		cacheContext.setValue('TEST_VALID_CACHE', 'valid', 30)

		expect(cacheContext.getValue('TEST_VALID_CACHE')).toEqual('valid')
	})
	it('should not return expired entries', () => {
		const cacheContext = getCacheContext()
		cacheContext.setValue('TEST_EXPIRED_CACHE', 'invalid', -30)
		expect(cacheContext.getValue('TEST_EXPIRED_CACHE')).toBeUndefined()
	})
})
