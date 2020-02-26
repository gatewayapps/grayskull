import { generateBackupMultifactorCode } from './generateBackupMultifactorCode'
import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
let dataContext: DataContext

describe('generateBackupMultifactorCode', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})
	it('should return a code', async () => {
		const code = await generateBackupMultifactorCode('test@test.com', 'abc123', dataContext)
		expect(code).toBeDefined()
	})
})
