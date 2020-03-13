import { getValue } from '../../operations/data/persistentCache/getValue'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { clearValue } from '../../operations/data/persistentCache/clearValue'

import { IAccessTokenResponse } from '../../foundation/types/tokens'

import { validateClientSecretActivity } from '../validateClientSecretActivity'

import { getTokensActivity } from './getTokensActivity'

/**
 * getTokens flow
 * 1. Validate the client and grant_type
 * 2. Verify the authorization code
 * 3. Lookup user from authorization code
 * 4. Get client and user client from db
 * 5. If id_token scope is allowed, create it
 * 6. If offline_access is allowed, create refresh_token
 * 7. Create an access_token
 */
export async function getTokensFromAuthorizationCodeActivity(
	clientId: string,
	clientSecret: string,
	code: string,
	context: IRequestContext
): Promise<IAccessTokenResponse> {
	if (!(await validateClientSecretActivity(clientId, clientSecret, context))) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `Failed to validate client`)
	}

	const codeStringValue = await getValue(code, context.dataContext)
	if (!codeStringValue) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `authorization_code has expired`)
	}

	const authCodeCacheResult = JSON.parse(codeStringValue)
	await clearValue(code, context.dataContext)

	if (!authCodeCacheResult) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `authorization_code has expired`)
	}
	return await getTokensActivity(
		authCodeCacheResult.userAccount.userAccountId,
		clientId,
		authCodeCacheResult.scope,
		context
	)
}
