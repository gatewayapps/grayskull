export class InvalidOperationError extends Error {
  code: string
  constructor(message: string, code: string) {
    super(message)
    this.name = 'InvalidOperationError'
    this.code = code
    Error.captureStackTrace(this, InvalidOperationError)
  }
}
