export interface ILoginResponse {
  success: boolean
  message?: string
  otpRequired?: boolean
  redirectUrl?: string
}
