import { IRequestContext } from "../../../foundation/context/prepareContext";
import { sendBackupCodeToEmailAddress } from "../../../activities/sendBackupCodeToEmailAddress";

export async function sendBackupCodeResolver(obj, args, context: IRequestContext) {
  try {
    await sendBackupCodeToEmailAddress(args.data.emailAddress, context)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
