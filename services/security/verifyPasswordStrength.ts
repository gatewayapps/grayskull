import { ISecurityConfiguration } from '../../data/types'

const LOWERCASE_REGEX = /[a-z]/
const UPPERCASE_REGEX = /[A-Z]/
const NUMBER_REGEX = /\d/
const SYMBOL_REGEX = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/

export interface IVerifyPasswordStrengthResult {
  success: boolean
  validationErrors?: string[]
}

export function isPasswordLongEnough(password: string, minimumLength: number | null) {
  return password.length >= minimumLength || 8
}

export function doesPasswordContainUppercase(password: string) {
  return UPPERCASE_REGEX.test(password)
}

export function doesPasswordContainLowercase(password: string) {
  return LOWERCASE_REGEX.test(password)
}
export function doesPasswordContainNumber(password: string) {
  return NUMBER_REGEX.test(password)
}
export function doesPasswordContainSymbol(password: string) {
  return SYMBOL_REGEX.test(password)
}

export function verifyPasswordStrength(
  password: string,
  securityConfiguration: ISecurityConfiguration
): IVerifyPasswordStrengthResult {
  let valid = true
  const validationErrors: string[] = []
  if (!isPasswordLongEnough(password, securityConfiguration.passwordMinimumLength)) {
    valid = false
    validationErrors.push(`Password must have at least ${securityConfiguration.passwordMinimumLength} characters`)
  }

  if (securityConfiguration.passwordRequiresUppercase && !doesPasswordContainUppercase(password)) {
    valid = false
    validationErrors.push('Password must contain an uppercase letter (A-Z)')
  }

  if (securityConfiguration.passwordRequiresLowercase && !doesPasswordContainLowercase(password)) {
    valid = false
    validationErrors.push('Password must contain a lowercase letter (a-z)')
  }

  if (securityConfiguration.passwordRequiresSymbol && !doesPasswordContainSymbol(password)) {
    valid = false
    validationErrors.push('Password must contain a symbol (!, #, @, etc...)')
  }

  if (securityConfiguration.passwordRequiresNumber && !doesPasswordContainNumber(password)) {
    valid = false
    validationErrors.push('Password must contain a number (0-9)')
  }

  return {
    success: valid,
    validationErrors: validationErrors.length > 0 ? validationErrors : undefined
  }
}
