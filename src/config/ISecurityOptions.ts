export interface ISecurityOptions {
  maxLoginAttemptsPerMinute: number
  passwordExpiresDays: number
  passwordRequiresLowercase: boolean
  passwordRequiresUppercase: boolean
  passwordRequiresNumber: boolean
  passwordRequiresSymbol: boolean
  passwordMinimumLength: number
  multifactorRequired: boolean
  adminEmailAddress: string
  globalSecret: string
  invitationExpiresIn: number
  accessTokenExpiresIn: number
}
