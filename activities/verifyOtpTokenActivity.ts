import otplib from 'otplib'
export async function verifyOtpTokenActivity(secret: string, token: string) {
	otplib.authenticator.options = {
		window: 2
	}
	return otplib.authenticator.check(token, secret)
}
