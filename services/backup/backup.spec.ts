import { getInMemoryContext } from '../../context/getDataContext.spec'
import { createTestUserAccount, TEST_USER_DATA } from '../user/createUserAccount.spec'
import { backup } from './backup'
import { decrypt } from '../../server/utils/cipher'

describe('backup', () => {
  it('should return an encrypted JSON string of the data', async () => {
    const dataContext = await getInMemoryContext()
    await createTestUserAccount(dataContext)
    const backupString = await backup(dataContext)
    expect(backupString.length).toBeGreaterThan(0)

    const decrypted = decrypt(backupString)

    expect(decrypted).toBeDefined()
    expect(typeof decrypted).toEqual(typeof '')

    if (decrypted) {
      const json = JSON.parse(decrypted)
      expect(json).toBeDefined()
      expect(json.userAccounts).toBeDefined()

      const user = json.userAccounts[0]
      expect(user.firstName).toEqual(TEST_USER_DATA.firstName)
    } else {
      expect(true).toBeFalsy()
    }
  })
})