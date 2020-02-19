jest.mock('../../../activities/updateScopesActivity', () => ({
  updateScopesActivity: () => 'test'
}))
import { updateClientScopesResolver } from './updateClientScopesResolver'
import { default as updateScopesActivity } from '../../../activities/updateScopesActivity'

describe('verifyEmailAddressResolver', () => {
  it('should invoke the updateScopesActivity', async () => {
    const context: any = {}
    const args: any = { data: { emailAddress: 'test@test.com', code: 'test' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(updateScopesActivity, 'updateScopesActivity')

    await updateClientScopesResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
