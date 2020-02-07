import { IRequestContext } from '../../../foundation/context/prepareContext'
import { IOperationResponse } from '../../../foundation/types/types'
import { validateRedirectUri } from '../../../activities/validateRedirectUri'

export async function verifyAuthorizationRequestResolver(
  obj,
  args,
  context: IRequestContext
): Promise<IOperationResponse> {
  const validRequest = await validateRedirectUri(args.data.client_id, args.data.redirect_uri, context)
  if (validRequest) {
    return {
      success: true
    }
  } else {
    return {
      success: false,
      message: 'Invalid redirectUri'
    }
  }
}
