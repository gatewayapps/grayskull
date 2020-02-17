export enum GrayskullErrorCode {
  EmailAlreadyRegistered = 'email_already_registered',
  EmailNotVerified = 'email_not_verified',
  InvalidBackupCode = 'invalid_backup_code',
  NotAuthorized = 'not_authorized',
  InvalidUserAccountId = 'invalid_user_account_id',
  InvalidEmailAddress = 'invalid_email_address',
  InvalidResetPasswordToken = 'invalid_reset_password_token',
  InvalidEmailVerificationCode = 'invalid_email_verification_code',
  ExpiredResetPasswordToken = 'expired_reset_password_token',
  PasswordFailsSecurityRequirements = 'password_fails_security_requirements',
  IncorrectPassword = 'incorrect_password',
  MultifactorRequired = 'multifactor_required',
  InvalidOTP = 'invalid_otp',
  RequiresOTP = 'requires_otp',
  InvalidClientId = 'invalid_client_id',
  InvalidResponseType = 'invalid_response_type',
  InvalidRuntimeEnvironment = 'invalid_runtime_environment'
}

export class GrayskullError extends Error {
  public code: GrayskullErrorCode

  constructor(code: GrayskullErrorCode, message: string) {
    super(message)

    this.code = code
  }
}
