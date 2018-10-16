export interface ISecurityOptions {
  maxLoginAttemptsPerMinute: number
  passwordExpiresDays: number
  passwordRequireLowercase: boolean
  passwordRequireUppercase: boolean
  passwordRequireNumber: boolean
  passwordRequireSymbol: boolean
  passwordMinimumLength: number
  multifactorRequired: boolean
  adminEmailAddress: string
  globalSecret: string
  invitationExpiresIn: number
  accessTokenExpiresIn: number
}
