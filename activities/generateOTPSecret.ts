import { IRequestContext } from '../foundation/context/prepareContext'
import * as otplib from 'otplib'

export async function generateOtpSecret(emailAddress: string, { configuration }: IRequestContext) {
  const secret = otplib.authenticator.generateSecret()
  const result = otplib.authenticator.keyuri(
    encodeURIComponent(emailAddress),
    encodeURIComponent(configuration.Server.realmName!),
    secret
  )
  return result
}
