import { validateClientSecretActivity } from '../validateClientSecretActivity'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { createAccessToken } from '../../operations/logic/createAccessToken'
import { getClient } from '../../operations/data/client/getClient'

export async function getTokensFromClientCredentialsActivity(
	clientId: string,
	clientSecret: string,
	context: IRequestContext
) {
	if (!(await validateClientSecretActivity(clientId, clientSecret, context))) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, 'Failed to verify client id and secret')
	}

	const client = await getClient(clientId, context.dataContext, true)

	const access_token = await createAccessToken(
		client!,
		undefined,
		undefined,
		context.configuration,
		context.dataContext
	)
	return {
		access_token,
		expires_in: context.configuration.Security.accessTokenExpirationSeconds || 300,
		token_type: 'Bearer'
	}
}
