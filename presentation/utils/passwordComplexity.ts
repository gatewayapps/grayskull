import { ISecurityConfiguration } from '../../foundation/types/types'

const LOWERCASE_REGEX = /[a-z]/
const UPPERCASE_REGEX = /[A-Z]/
const NUMBER_REGEX = /\d/
const SYMBOL_REGEX = /[-!@#$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/

export function hasLowercase(password: string): boolean {
	return LOWERCASE_REGEX.test(password)
}

export function hasUppercase(password: string): boolean {
	return UPPERCASE_REGEX.test(password)
}

export function hasNumber(password: string): boolean {
	return NUMBER_REGEX.test(password)
}

export function hasSymbol(password: string): boolean {
	return SYMBOL_REGEX.test(password)
}

export function hasMinLength(password: string, minLength: number): boolean {
	return typeof password === 'string' && password.length >= minLength
}

export function validatePassword(password: string, configuration: ISecurityConfiguration): boolean {
	if (configuration.passwordMinimumLength && !hasMinLength(password, configuration.passwordMinimumLength)) {
		return false
	}
	if (configuration.passwordRequiresLowercase && !hasLowercase(password)) {
		return false
	}
	if (configuration.passwordRequiresUppercase && !hasUppercase(password)) {
		return false
	}
	if (configuration.passwordRequiresNumber && !hasNumber(password)) {
		return false
	}
	if (configuration.passwordRequiresSymbol && !hasSymbol(password)) {
		return false
	}
	return true
}
