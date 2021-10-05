import { setEmailAddressVerified } from './setEmailAddressVerified'

import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createEmailAddress } from './createEmailAddress'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import Knex from 'knex'

let dataContext: Knex
describe('setEmailAddressVerified', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})

	it('Should correctly mark an email as verified', async () => {
		await createEmailAddress('unverified@test.com', 'abc123', dataContext, true, false)
		const verifiedRecord: any = await setEmailAddressVerified('unverified@test.com', dataContext)
		expect(verifiedRecord).toBeDefined()
		if (verifiedRecord) {
			expect(verifiedRecord.verified).toBeTruthy()
		}
	})
	it('Should throw an error when passed an email address thats already verified', async () => {
		const emailRecord = await createEmailAddress('unverified2@test.com', 'abc123', dataContext, true, false)
		expect(emailRecord).toBeDefined()
		if (emailRecord) {
			await setEmailAddressVerified(emailRecord.emailAddress, dataContext)
			let failed = false
			try {
				await setEmailAddressVerified('unverified2@test.com', dataContext)
			} catch (err) {
				failed = true
				expect(err).toBeInstanceOf(GrayskullError)
				if (err instanceof GrayskullError) {
					expect(err.code).toEqual(GrayskullErrorCode.InvalidEmailVerificationCode)
				}
			}
			expect(failed).toEqual(true)
		}
	})
})
