import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { generatePhoneNumberVerificationCode } from '../operations/data/phoneNumber/generatePhoneNumberVerificationCode'

export async function sendVerificationCodeToPhoneNumber(phoneNumber: string, context: IRequestContext) {
  ensureAuthenticated(context)
  const code = await generatePhoneNumberVerificationCode(phoneNumber, 300, context.dataContext)
}
