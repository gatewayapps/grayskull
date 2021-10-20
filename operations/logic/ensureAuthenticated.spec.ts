import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { ensureAuthenticated } from './ensureAuthenticated'

describe('ensureAuthenticated', () => {
	let requestContext: IRequestContext

	beforeAll(() => {
		requestContext = {} as IRequestContext
	})

	it('should throw error when the user does not exist on the context', async () => {
		try {
			expect.assertions(1)
			await ensureAuthenticated(requestContext)
		} catch (err) {
			expect(err).toEqual(new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be signed in to do that'))
		}
	})

	it('should ensure that the user exists', async () => {
		const result = await ensureAuthenticated({
			...requestContext,
			user: {}
		} as IRequestContext)

		expect(result).toEqual(true)
	})
})
