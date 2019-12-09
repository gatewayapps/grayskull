export interface ISecurityConfiguration {
  maxLoginAttemptsPerMinute?: number | null
  maxPasswordAge?: number | null
  passwordRequiresLowercase?: boolean | null
  passwordRequiresUppercase?: boolean | null
  passwordRequiresNumber?: boolean | null
  passwordRequiresSymbol?: boolean | null
  passwordMinimumLength?: number | null
  multifactorRequired?: boolean | null
  requireEmailAddressVerification?: boolean | null
  passwordHistoryEnabled?: boolean | null
  passwordHistoryCount?: number | null
  invitationExpirationSeconds?: number | null
  accessTokenExpirationSeconds?: number | null
  domainWhitelist?: string | null
  allowSignup?: boolean | null
}
