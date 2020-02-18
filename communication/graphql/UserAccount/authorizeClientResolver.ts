import { IRequestContext } from '../../../foundation/context/prepareContext'

import { validateRedirectUri } from '../../../activities/validateRedirectUri'
import { verifyUserScopesForClient } from '../../../activities/verifyUserScopesForClient'
import { generateAuthorizationRedirect } from '../../../activities/generateAuthorizationRedirect'

export async function authorizeClientResolver(obj, args, context: IRequestContext) {
  try {
    if (!context.user) {
      throw new Error('You must be logged in')
    }

    const { client_id, responseType, redirectUri, scope, state, nonce } = args.data

    if (await !validateRedirectUri(client_id, redirectUri, context)) {
      throw new Error('Invalid redirect uri')
    }

    const { pendingScopes } = await verifyUserScopesForClient(client_id, scope, context)

    if (pendingScopes && pendingScopes.length > 0) {
      return {
        pendingScopes
      }
    }
    const responseTypes: string[] = responseType.split(' ')

    const authorizationUrl = await generateAuthorizationRedirect(
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
  } catch (err) {
    console.error(err)
    throw err
  }
}