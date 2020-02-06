import { IRequestContext } from '../../../foundation/context/prepareContext'
import { IOperationResponse } from '../../../foundation/types/types'
import { verifyEmailAddress } from '../../../activities/verifyEmailAddress'

export async function verifyEmailAddressResolver(obj, args, context: IRequestContext): Promise<IOperationResponse> {
  try {
    await verifyEmailAddress(decodeURIComponent(args.data.emailAddress), args.data.code, context)
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}
