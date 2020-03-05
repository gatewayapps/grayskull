import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { restore } from './restore'
import { TEST_USER_DATA, createTestUserAccount } from '../userAccount/createUserAccount.spec'
import { backup } from './backup'
import { IUserAccount } from '../../../foundation/types/types'

describe('restore', () => {
	it('should correctly restore data to a database', async () => {
		const dataContext = await getInMemoryContext()
		await createTestUserAccount(dataContext)

		const encryptedTest = await backup(dataContext)
		expect(encryptedTest).toBeDefined()

		await restore(encryptedTest, dataContext)
		const user = await dataContext<IUserAccount>('UserAccounts')
			.select('*')
			.first()
		expect(user).toBeDefined()

		const userCount = await dataContext<IUserAccount>('UserAccounts').count('*', { as: 'userCount' })

		expect(userCount).toBeDefined()
		if (userCount) {
			expect(userCount[0]['userCount']).toEqual(1)
		}

		if (user) {
			expect(user.firstName).toEqual(TEST_USER_DATA.firstName)
		} else {
			expect(true).toBeFalsy()
		}
	})
})
