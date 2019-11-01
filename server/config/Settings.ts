




export const SettingNames = {
  Server: { baseUrl: 'SERVER_BASE_URL', realmName: 'SERVER_REALM_NAME' },
  Mail: {
    host: 'MAIL_HOST',
    user: 'MAIL_USER',
    password: 'MAIL_PASSWORD',
    ssl: 'MAIL_SSL',
    port: 'MAIL_PORT'
  },
  Security: {
    maxLoginAttemptsPerMinute: 'SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE'
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
}
