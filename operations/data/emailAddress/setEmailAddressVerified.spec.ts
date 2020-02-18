import { setEmailAddressVerified } from './setEmailAddressVerified'
import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createEmailAddress } from './createEmailAddress'
import { GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

let dataContext: DataContext
describe('setEmailAddressVerified', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })

  it('Should correctly mark an email as verified', async () => {
    await createEmailAddress('unverified@test.com', 'abc123', dataContext, true, false)
    const verifiedRecord: any = await setEmailAddressVerified('unverified@test.com', dataContext)
    expect(verifiedRecord).toBeDefined()
    if (verifiedRecord) {
      expect(verifiedRecord.verified).toEqual(true)
    }
  })
  it('Should throw an error when passed an email address thats already verified', async () => {
    const emailRecord = await createEmailAddress('unverified2@test.com', 'abc123', dataContext, true, false)
    await setEmailAddressVerified(emailRecord.emailAddress, dataContext)
    let failed = false
    try {
      await setEmailAddressVerified('unverified2@test.com', dataContext)
    } catch (err) {
      failed = true

      expect(err.code).toEqual(GrayskullErrorCode.InvalidEmailVerificationCode)
    }
    expect(failed).toEqual(true)
  })
})
