export enum GrayskullErrorCode {
  EmailAlreadyRegistered = 'email_already_registered',
  InvalidBackupCode = 'invalid_backup_code',
  NotAuthorized = 'not_authorized',
  InvalidUserAccountId = 'invalid_user_account_id',
  InvalidEmailAddress = 'invalid_email_address',
  InvalidResetPasswordToken = 'invalid_reset_password_token',
  ExpiredResetPasswordToken = 'expired_reset_password_token',
  PasswordFailsSecurityRequirements = 'password_fails_security_requirements',
  IncorrectPassword = 'incorrect_password'
}

export class GrayskullError extends Error {
  public code: GrayskullErrorCode

  constructor(code: GrayskullErrorCode, message: string) {
    super(message)

    this.code = code
  }
}
