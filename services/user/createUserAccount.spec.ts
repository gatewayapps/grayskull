import { DataContext } from '../../context/getDataContext'
import { getInMemoryContext } from '../../context/getDataContext.spec'
import { UserAccount } from '../../server/data/models/UserAccount'
import { createUserAccount } from './createUserAccount'

let dataContext: DataContext

beforeAll(async () => {
  dataContext = await getInMemoryContext()
})

describe('createUserAccount', () => {
  it('Should correctly create a user account', async () => {
    const userData: Partial<UserAccount> = {
      firstName: 'Test',
      lastName: 'User',
      permissions: 0,
      otpEnabled: false,
      isActive: true
    }

    const createdUser = await createUserAccount(userData, 'password', dataContext)
    expect(createdUser).toBeDefined()
    const userFromData = await dataContext.UserAccount.findOne({ where: { userAccountId: createdUser.userAccountId } })

    expect(userFromData).toBeDefined()
    if (userFromData) {
      expect(userFromData.firstName).toEqual(userData.firstName)
      expect(userFromData.lastName).toEqual(userData.lastName)
    }
  })
})
