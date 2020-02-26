import { IRequestContext } from '../../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'

export async function ensureAuthenticated(context: IRequestContext) {
	if (!context.user) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be signed in to do that')
	}
	return true
}
