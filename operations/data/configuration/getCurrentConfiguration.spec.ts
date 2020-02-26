import { getCurrentConfiguration } from './getCurrentConfiguration'
import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { getCacheContext, CacheContext } from '../../../foundation/context/getCacheContext'

let dataContext: DataContext
let cacheContext: CacheContext

describe('getCurrentConfiguration', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
		cacheContext = await getCacheContext()
	})
	it('Should return a valid configuration', async () => {
		const config = await getCurrentConfiguration(dataContext, cacheContext)
		expect(config).toBeDefined()
	})
})
