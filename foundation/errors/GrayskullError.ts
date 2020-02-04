export enum GrayskullErrorCode {
  EmailAlreadyRegistered = 'email_already_registered',
  InvalidBackupCode = 'invalid_backup_code',
  NotAuthorized = 'not_authorized'
}

export class GrayskullError extends Error {
  public code: GrayskullErrorCode

  constructor(code: GrayskullErrorCode, message: string) {
    super(message)

    this.code = code
  }
}
