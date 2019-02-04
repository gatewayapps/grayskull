export interface ILoginResponse {
  success: boolean
  message?: string
  otpRequired?: boolean
  emailVerificationRequired?: boolean
}
