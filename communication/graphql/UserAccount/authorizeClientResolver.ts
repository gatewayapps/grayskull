import { IRequestContext } from '../../../foundation/context/prepareContext'

import { validateRedirectUriActivity } from '../../../activities/validateRedirectUriActivity'
import { verifyUserScopesForClientActivity } from '../../../activities/verifyUserScopesForClientActivity'
import { generateAuthorizationRedirectActivity } from '../../../activities/generateAuthorizationRedirectActivity'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function authorizeClientResolver(obj, args, context: IRequestContext) {
  if (!context.user) {
    throw new Error('You must be logged in')
  }

  const { client_id, responseType, redirectUri, scope, state, nonce } = args.data

  if (!scope) {
    throw new GrayskullError(GrayskullErrorCode.InvalidAuthorizeRequest, `You must provide a scope value`)
  }

  if (await !validateRedirectUriActivity(client_id, redirectUri, context)) {
    throw new Error('Invalid redirect uri')
  }

  const { pendingScopes } = await verifyUserScopesForClientActivity(client_id, scope, context)

  if (pendingScopes && pendingScopes.length > 0) {
    return {
      pendingScopes
    }
  }
  const responseTypes: string[] = responseType.split(' ')

  const authorizationUrl = await generateAuthorizationRedirectActivity(
    client_id,
    responseTypes,
    redirectUri,
    state,
    nonce,
    context
  )

  return {
    redirectUri: authorizationUrl
  }
}
