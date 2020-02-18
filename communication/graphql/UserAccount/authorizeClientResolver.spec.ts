jest.mock('../../../activities/validateRedirectUri', () => ({
  validateRedirectUri: () => true
}))

jest.mock('../../../activities/generateAuthorizationRedirect', () => ({
  generateAuthorizationRedirect: () => 'test'
}))

jest.mock('../../../activities/verifyUserScopesForClient', () => ({
  verifyUserScopesForClient: () => 'test'
}))
import { default as validateRedirectUriActivity } from '../../../activities/validateRedirectUri'
import { default as generateAuthorizationRedirectActivity } from '../../../activities/generateAuthorizationRedirect'
import { default as verifyUserScopesForClientActivity } from '../../../activities/verifyUserScopesForClient'

import { authorizeClientResolver } from './authorizeClientResolver'

describe('authorizeClientResolver', () => {
  it('should call the verifyEmailAddress activity', async () => {
    const context: any = { user: true }
    const args: any = { data: { emailAddress: 'test@test.com', code: 'test', responseType: 'code', scope: 'profile' } }
    const obj: any = {}

    const validateRedirectUriSpy = jest.spyOn(validateRedirectUriActivity, 'validateRedirectUri')
    const generateAuthorizationRedirectSpy = jest.spyOn(
      generateAuthorizationRedirectActivity,
      'generateAuthorizationRedirect'
    )
    const verifyUserScopesForClientSpy = jest.spyOn(verifyUserScopesForClientActivity, 'verifyUserScopesForClient')

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
