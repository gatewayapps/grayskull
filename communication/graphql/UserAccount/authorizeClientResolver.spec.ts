jest.mock('../../../activities/validateRedirectUriActivity', () => ({
  validateRedirectUriActivity: () => true
}))

jest.mock('../../../activities/generateAuthorizationRedirectActivity', () => ({
  generateAuthorizationRedirectActivity: () => 'test'
}))

jest.mock('../../../activities/verifyUserScopesForClientActivity', () => ({
  verifyUserScopesForClientActivity: () => 'test'
}))
import { default as validateRedirectUriActivity } from '../../../activities/validateRedirectUriActivity'
import { default as generateAuthorizationRedirectActivity } from '../../../activities/generateAuthorizationRedirectActivity'
import { default as verifyUserScopesForClientActivity } from '../../../activities/verifyUserScopesForClientActivity'

import { authorizeClientResolver } from './authorizeClientResolver'

describe('authorizeClientResolver', () => {
  it('should call the verifyEmailAddress activity', async () => {
    const context: any = { user: true }
    const args: any = { data: { emailAddress: 'test@test.com', code: 'test', responseType: 'code', scope: 'profile' } }
    const obj: any = {}

    const validateRedirectUriSpy = jest.spyOn(validateRedirectUriActivity, 'validateRedirectUriActivity')
    const generateAuthorizationRedirectSpy = jest.spyOn(
      generateAuthorizationRedirectActivity,
      'generateAuthorizationRedirectActivity'
    )
    const verifyUserScopesForClientSpy = jest.spyOn(
      verifyUserScopesForClientActivity,
      'verifyUserScopesForClientActivity'
    )

    await authorizeClientResolver(obj, args, context)

    expect(validateRedirectUriSpy).toBeCalledTimes(1)
    expect(generateAuthorizationRedirectSpy).toBeCalledTimes(1)
    expect(verifyUserScopesForClientSpy).toBeCalledTimes(1)
  })
  it('should throw an error if not passed valid scopes', async () => {
    const context: any = { user: true }
    const args: any = { data: { emailAddress: 'test@test.com', code: 'test', responseType: 'code' } }
    const obj: any = {}
    let failed = false
    try {
      await authorizeClientResolver(obj, args, context)
    } catch {
      failed = true
    }
    expect(failed).toBeTruthy()
  })
})
