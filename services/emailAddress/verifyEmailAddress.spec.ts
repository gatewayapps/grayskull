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
  it('Should throw an error when passed an invalid verification code', async () => {
    await createEmailAddress('unverified_fail@test.com', 'abc123', dataContext, true, false)
    expect(verifyEmailAddress('unverified@test.com', 'NEVER GOING TO MATCH', dataContext)).rejects.toThrow()
  })
})
