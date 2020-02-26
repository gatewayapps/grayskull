import * as otplib from 'otplib'
export async function verifyOtpTokenActivity(secret: string, token: string) {
	return otplib.authenticator.check(token, secret)
}
