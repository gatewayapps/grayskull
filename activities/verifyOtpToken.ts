import * as otplib from 'otplib'
export async function verifyOtpToken(secret: string, token: string) {
  return otplib.authenticator.check(token, secret)
}
