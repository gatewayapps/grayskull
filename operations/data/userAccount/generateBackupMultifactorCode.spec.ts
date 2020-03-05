import { generateBackupMultifactorCode } from './generateBackupMultifactorCode'

import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import Knex from 'knex'
let dataContext: Knex

describe('generateBackupMultifactorCode', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})
	it('should return a code', async () => {
		const code = await generateBackupMultifactorCode('test@test.com', 'abc123', dataContext)
		expect(code).toBeDefined()
	})
})
