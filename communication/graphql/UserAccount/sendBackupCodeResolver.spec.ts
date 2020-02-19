jest.mock('../../../activities/sendBackupCodeToEmailAddressActivity', () => ({
  sendBackupCodeToEmailAddressActivity: () => {
    return {
      userAccountId: 'abc'
    }
  }
}))
import { sendBackupCodeResolver } from './sendBackupCodeResolver'
import { default as sendBackupCodeToEmailAddressActivity } from '../../../activities/sendBackupCodeToEmailAddressActivity'

describe('verifyEmailAddressResolver', () => {
  it('should call the verifyEmailAddress activity', async () => {
    const context: any = {}
    const args: any = { data: { emailAddress: 'test@test.com' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(sendBackupCodeToEmailAddressActivity, 'sendBackupCodeToEmailAddressActivity')

    await sendBackupCodeResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
