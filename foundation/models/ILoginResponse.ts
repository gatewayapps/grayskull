export interface ILoginResponse {
	success: boolean
	message?: string | null
	otpRequired?: boolean | null
	emailVerificationRequired?: boolean | null
}
