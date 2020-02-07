import { IRequestContext } from "../../../foundation/context/prepareContext";
import { generateOtpSecret } from "../../../activities/generateOTPSecret";

export async function generateMfaKeyResolver(obj, args, context: IRequestContext) {
  return generateOtpSecret(args.data.emailAddress, context)
}
