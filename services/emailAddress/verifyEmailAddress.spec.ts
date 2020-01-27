import { verifyEmailAddress } from './verifyEmailAddress'
import { DataContext } from '../../context/getDataContext'
import { getInMemoryContext } from '../../context/getDataContext.spec'
import { createEmailAddress } from './createEmailAddress'

let dataContext: DataContext
describe('verifyEmailAddress', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })

  it('Should correctly mark an email as verified when passed a valid verification code', async () => {
    const emailRecord = await createEmailAddress('unverified@test.com', 'abc123', dataContext, true, false)
    const verifiedRecord: any = await verifyEmailAddress(
      'unverified@test.com',
      emailRecord.verificationSecret,
      dataContext
    )
    expect(verifiedRecord).toBeDefined()
    if (verifiedRecord) {
      expect(verifiedRecord.verified).toEqual(true)
    }
  })
  it('Should throw an error when passed an email address thats already verified', async () => {
    const emailRecord = await createEmailAddress('unverified2@test.com', 'abc123', dataContext, true, false)
    await verifyEmailAddress(emailRecord.emailAddress, emailRecord.verificationSecret, dataContext)
    let failed = false
    try {
      await verifyEmailAddress('unverified2@test.com', emailRecord.verificationSecret, dataContext)
    } catch (err) {
      failed = true
      expect(err.message).toEqual('E-mail address is already verified')
      expect(err.code).toEqual('E_ADDRESS_VERIFIED')
    }
    expect(failed).toEqual(true)
  })
  it('Should throw an error when passed an invalid verification code', async () => {
    await createEmailAddress('unverified_fail@test.com', 'abc123', dataContext, true, false)
    let failed = false
    try {
      await verifyEmailAddress('unverified@test.com', 'NEVER GOING TO MATCH', dataContext)
    } catch (err) {
      expect(err.message).toEqual('Invalid e-mail address or verification secret')
      expect(err.code).toEqual('E_UNKNOWN_ADDRESS')
      failed = true
    }
    expect(failed).toEqual(true)
  })
})
