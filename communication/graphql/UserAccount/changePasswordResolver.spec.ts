jest.mock('../../../activities/changePasswordWithToken', () => ({
  changePasswordWithToken: () => true
}))

jest.mock('../../../activities/changePasswordWithOldPassword', () => ({
  changePasswordWithOldPassword: () => true
}))

import { changePasswordResolver } from './changePasswordResolver'
import { default as changePasswordWithTokenActivity } from '../../../activities/changePasswordWithToken'
import { default as changePasswordWithOldPasswordActivity } from '../../../activities/changePasswordWithOldPassword'

describe('changePasswordResolver', () => {
  it('should call the changePasswordWithTokenActivity when called with a token', async () => {
    const context: any = {}
    const args: any = { data: { token: 'test' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(changePasswordWithTokenActivity, 'changePasswordWithToken')

    await changePasswordResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })

  it('should call the changePasswordWithOldPasswordActivity when called with a token', async () => {
    const context: any = {}
    const args: any = { data: {} }
    const obj: any = {}

    const resolverSpy = jest.spyOn(changePasswordWithOldPasswordActivity, 'changePasswordWithOldPassword')
    await changePasswordResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
