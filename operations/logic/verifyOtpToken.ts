import otplib from 'otplib'
export function verifyOtpToken(token: string, secret?: string | null): boolean {
	if (!secret) return false
	otplib.authenticator.options = {
		window: 2
	}
	return otplib.authenticator.check(token, secret)
}
