import { createEmailAddress } from './createEmailAddress'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import Knex from 'knex'

let dataContext: Knex

describe('createEmailAddress', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})

	it('Should create an email address for the provided user account Id', async () => {
		const emailRecord = await createEmailAddress('test@test.com', 'abc123', dataContext, true, true)
		if (emailRecord) {
			expect(emailRecord.primary).toBeTruthy()
			expect(emailRecord.userAccountId).toEqual('abc123')
			expect(emailRecord.verified).toBeTruthy()
			expect(emailRecord.emailAddressId).toBeDefined()
			expect(emailRecord.emailAddress).toEqual('test@test.com')
		}
	})

	it('Should throw if a duplicate email address is created', async () => {
		await createEmailAddress('duplicate@test.com', 'abc123', dataContext, true, true)
		expect(createEmailAddress('duplicate@test.com', 'abc123', dataContext, true, true)).rejects.toThrow()
	})
})
