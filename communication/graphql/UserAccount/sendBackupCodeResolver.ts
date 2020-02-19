import { IRequestContext } from '../../../foundation/context/prepareContext'
import { sendBackupCodeToEmailAddressActivity } from '../../../activities/sendBackupCodeToEmailAddressActivity'

export async function sendBackupCodeResolver(obj, args, context: IRequestContext) {
  try {
    await sendBackupCodeToEmailAddressActivity(args.data.emailAddress, context)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
