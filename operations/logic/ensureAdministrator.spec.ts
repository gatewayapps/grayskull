import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { Permissions } from '../../foundation/constants/permissions'
import { ensureAdministrator } from './ensureAdministrator'

describe('ensureAdministrator', () => {
	let requestContext: IRequestContext

	beforeAll(() => {
		requestContext = {} as IRequestContext
	})

	it('should ensure that user exits on context', async () => {
		try {
			expect.assertions(1)
			await ensureAdministrator(requestContext)
		} catch (err) {
			expect(err).toEqual(new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be an admin to do that'))
		}
	})

	it('should ensure that user has admin permission', async () => {
		try {
			expect.assertions(1)
			await ensureAdministrator({
				...requestContext,
				user: { permissions: Permissions.User } as IRequestContext['user']
			})
		} catch (err) {
			expect(err).toEqual(new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be an admin to do that'))
		}
	})

	it('should not throw and error when user exists and has admin permission', async () => {
		try {
			expect.assertions(0)
			await ensureAdministrator({
				...requestContext,
				user: { permissions: Permissions.Admin } as IRequestContext['user']
			})
		} catch (err) {
			expect(err).toEqual(undefined)
		}
	})
})
