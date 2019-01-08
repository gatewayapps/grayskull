const LOWERCASE_REGEX = /[a-z]/
const UPPERCASE_REGEX = /[A-Z]/
const NUMBER_REGEX = /\d/
const SYMBOL_REGEX = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/

export function hasLowercase(password) {
  return LOWERCASE_REGEX.test(password)
}

export function hasUppercase(password) {
  return UPPERCASE_REGEX.test(password)
}

export function hasNumber(password) {
  return NUMBER_REGEX.test(password)
}

export function hasSymbol(password) {
  return SYMBOL_REGEX.test(password)
}

export function hasMinLength(password, minLength) {
  return typeof password === 'string' && password.length >= minLength
}

export function validatePassword(password, configuration) {
  if (configuration.minLength && !hasMinLength(password, configuration.minLength)) {
    return false
  }
  if (configuration.passwordRequireLowercase && !hasLowercase(password)) {
    return false
  }
  if (configuration.passwordRequireUppercase && !hasUppercase(password)) {
    return false
  }
  if (configuration.passwordRequireNumber && !hasNumber(password)) {
    return false
  }
  if (configuration.passwordRequireSymbol && !hasSymbol(password)) {
    return false
  }
  return true
}
