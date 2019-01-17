export interface ISecurityConfiguration {
  maxLoginAttemptsPerMinute: number
  maxPasswordAge: number
  passwordRequiresLowercase: boolean
  passwordRequiresUppercase: boolean
  passwordRequiresNumber: boolean
  passwordRequiresSymbol: boolean
  passwordMinimumLength: number
  multifactorRequired: boolean
  invitationExpirationSeconds: number
  accessTokenExpirationSeconds: number
  globalSecret: string
}
