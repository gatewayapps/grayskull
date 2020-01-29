import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { UserAccount } from '../../../foundation/models/UserAccount'
import { createUserAccount } from './createUserAccount'

let dataContext: DataContext

export const TEST_USER_DATA: Partial<UserAccount> = {
  firstName: 'Test',
  lastName: 'User',
  permissions: 0,
  otpEnabled: false,
  isActive: true
}

export async function createTestUserAccount(dataContext: DataContext) {
  return await createUserAccount(TEST_USER_DATA, 'password', dataContext)
}

describe('createUserAccount', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })

  it('Should correctly create a user account', async () => {
    const createdUser = await createTestUserAccount(dataContext)
    expect(createdUser).toBeDefined()
    const userFromData = await dataContext.UserAccount.findOne({ where: { userAccountId: createdUser.userAccountId } })

    expect(userFromData).toBeDefined()
    if (userFromData) {
      expect(userFromData.firstName).toEqual(TEST_USER_DATA.firstName)
      expect(userFromData.lastName).toEqual(TEST_USER_DATA.lastName)
    }
  })
})
