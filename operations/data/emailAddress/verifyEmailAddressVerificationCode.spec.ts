import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { generateEmailAddressVerificationCode } from './generateEmailAddressVerificationCode'
import { verifyEmailAddressVerificationCode } from './verifyEmailAddressVerificationCode'
let dataContext: DataContext
let verificationCode: string
const TEST_EMAIL_ADDRESS = 'test@test.com'
describe('verifyEmailAddressVerificationCode', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
		verificationCode = await generateEmailAddressVerificationCode(TEST_EMAIL_ADDRESS, 300, dataContext)
	})
	it('should return true for a matching code and emailAddress', async () => {
		const verified = await verifyEmailAddressVerificationCode(TEST_EMAIL_ADDRESS, verificationCode, dataContext)
		expect(verified).toBeTruthy()
	})
	it('should return false for an invalid code', async () => {
		const verified = await verifyEmailAddressVerificationCode('abc@123.com', '1234565', dataContext)
		expect(verified).toBeFalsy()
	})
})
