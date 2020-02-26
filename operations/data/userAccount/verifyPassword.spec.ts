import { verifyPassword } from './verifyPassword'
import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createUserAccount } from '../userAccount/createUserAccount'

let dataContext: DataContext

describe('verifyPassword', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})
	it('Should throw when given an invalid user account id', async () => {
		expect(verifyPassword('abc123', 'testpass', dataContext)).rejects.toThrow()
	})
	it('Should return false when passed a valid user accountId and invalid password', async () => {
		const createdUser = await createUserAccount(
			{ firstName: 'test', lastName: 'user', otpEnabled: false, isActive: true, permissions: 1 },
			'password1',
			dataContext,
			undefined
		)

		const passwordVerified = await verifyPassword(createdUser.userAccountId, 'wrongPassword', dataContext)
		expect(passwordVerified).toEqual(false)
	})
	it('Should return true when passed a valid userAccountId and password', async () => {
		const createdUser = await createUserAccount(
			{ firstName: 'test', lastName: 'user', otpEnabled: false, isActive: true, permissions: 1 },
			'password1',
			dataContext,
			undefined
		)

		const passwordVerified = await verifyPassword(createdUser.userAccountId, 'password1', dataContext)
		expect(passwordVerified).toEqual(true)
	})
})
