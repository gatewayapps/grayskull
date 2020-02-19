import { IRequestContext } from '../../../foundation/context/prepareContext'
import { IOperationResponse } from '../../../foundation/types/types'
import { validateRedirectUriActivity } from '../../../activities/validateRedirectUriActivity'

export async function verifyAuthorizationRequestResolver(
  obj,
  args,
  context: IRequestContext
): Promise<IOperationResponse> {
  const validRequest = await validateRedirectUriActivity(args.data.client_id, args.data.redirect_uri, context)
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
