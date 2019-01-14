export enum GrayskullErrorCode {
  EmailAlreadyRegistered = 'email_already_registered',
}

export class GrayskullError extends Error {
  public code: GrayskullErrorCode

  constructor(code: GrayskullErrorCode, message: string) {
    super(message)
    this.code = code
  }
}
