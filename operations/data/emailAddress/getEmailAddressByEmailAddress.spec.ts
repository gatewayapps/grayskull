import { DataContext } from '../../../foundation/context/getDataContext'

import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createEmailAddress } from './createEmailAddress'
import { getEmailAddressByEmailAddress } from './getEmailAddressByEmailAddress'

let dataContext: DataContext

describe('getEmailAddressByEmailAddress', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })
  it('should return an email address that exists', async () => {
    await createEmailAddress('test@test.com', 'abc123', dataContext, true, true)
    const emailAddressRecord = await getEmailAddressByEmailAddress('test@test.com', dataContext)
    expect(emailAddressRecord).toBeDefined()
    if (emailAddressRecord) {
      expect(emailAddressRecord.emailAddress).toEqual('test@test.com')
      expect(emailAddressRecord.userAccountId).toEqual('abc123')
    }
  })
  it('should not return an email address that does not exist', async () => {
    const emailAddressRecord = await getEmailAddressByEmailAddress('test2@test.com', dataContext)
    expect(emailAddressRecord).toBeNull()
  })
})
