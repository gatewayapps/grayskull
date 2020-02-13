jest.mock('../../../activities/sendBackupCodeToEmailAddress', () => ({
  sendBackupCodeToEmailAddress: () => {
    return {
      userAccountId: 'abc'
    }
  }
}))
import { sendBackupCodeResolver } from './sendBackupCodeResolver'
import { default as sendBackupCodeToEmailAddressActivity } from '../../../activities/sendBackupCodeToEmailAddress'

describe('verifyEmailAddressResolver', () => {
  it('should call the verifyEmailAddress activity', async () => {
    const context: any = {}
    const args: any = { data: { emailAddress: 'test@test.com' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(sendBackupCodeToEmailAddressActivity, 'sendBackupCodeToEmailAddress')

    await sendBackupCodeResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
