import { ISecurityConfiguration } from '../../foundation/types/types'
import * as passwordComplexity from './passwordComplexity'

describe('passwordComplexity', () => {
	let configuration: ISecurityConfiguration

	beforeAll(() => {
		configuration = {
			passwordMinimumLength: 6,
			passwordRequiresSymbol: true,
			passwordRequiresNumber: true,
			passwordRequiresLowercase: true,
			passwordRequiresUppercase: true
		}
	})

	it('should return true if the password has a lowercase letter', () => {
		const passwords = ['TestingPassword', 'abcd1234', 'aBcDeFg', 'tESTING']
		const lowercaseTestResults = passwords.map((password) => passwordComplexity.hasLowercase(password))

		expect(lowercaseTestResults).not.toContain(false)
	})
	it('should return false if the password has no lowercase letter', () => {
		const passwords = ['TESTINGPASSWORD', 'ABCD1234', 'A', '102938475']
		const lowercaseTestResults = passwords.map((password) => passwordComplexity.hasLowercase(password))

		expect(lowercaseTestResults).not.toContain(true)
	})

	it('should return true if the password has an uppercase letter', () => {
		const passwords = ['TestingPassword', 'abCd1234', 'aBcDeFg', 'tESTING']
		const uppercaseTestResults = passwords.map((password) => passwordComplexity.hasUppercase(password))

		expect(uppercaseTestResults).not.toContain(false)
	})
	it('should return false if the password has no uppercase letter', () => {
		const passwords = ['testingpassword', 'abcd1234', 'a', '102938475']
		const uppercaseTestResults = passwords.map((password) => passwordComplexity.hasUppercase(password))

		expect(uppercaseTestResults).not.toContain(true)
	})

	it('should return true if the password has a number', () => {
		const passwords = ['TestingPassword123', 'abcd1234', 'aBc3D4eFg', 'tESTING1']
		const numberTetsResults = passwords.map((password) => passwordComplexity.hasNumber(password))

		expect(numberTetsResults).not.toContain(false)
	})
	it('should return false if the password has no number', () => {
		const passwords = ['TestingPassword', 'abcd', 'aBcDeFg', 'tESTING']
		const numberTetsResults = passwords.map((password) => passwordComplexity.hasNumber(password))

		expect(numberTetsResults).not.toContain(true)
	})

	it('should return true if the password has a symbol', () => {
		const passwords = ['TestingPassword123!', 'abcd1234#$', '!aBc3D4eFg$', 'tESTING1!#@!']
		const symbolTestResults = passwords.map((password) => passwordComplexity.hasSymbol(password))

		expect(symbolTestResults).not.toContain(false)
	})
	it('should return false if the password has no symbol', () => {
		const passwords = ['TestingPassword123', 'abcd1234', 'aBc3D4eFg', 'tESTING1']
		const symbolTestResults = passwords.map((password) => passwordComplexity.hasSymbol(password))

		expect(symbolTestResults).not.toContain(true)
	})

	it('should return true if the password has the minimum length', () => {
		const passwords = ['TestingPassword123', 'abcd1234', 'aBc3D4eFg', 'tESTING1']
		const minLengthResults = passwords.map((password) => passwordComplexity.hasMinLength(password, 8))

		expect(minLengthResults).not.toContain(false)
	})
	it('should return false if the password has less than the minimum length', () => {
		const passwords = ['TestingPassword123', 'abcd1234', 'aBc3D4eFg', 'tESTING1']
		const minLengthResults = passwords.map((password) => passwordComplexity.hasMinLength(password, 28))

		expect(minLengthResults).not.toContain(true)
	})

	it('should return true if the password passes all the validation tests', () => {
		const passwords = ['TestingPassword123!', 'Abc#d1234$', '$aBc3D4eFg', '<>tESTING1<>']
		const validationResults = passwords.map((password) => passwordComplexity.validatePassword(password, configuration))

		expect(validationResults).not.toContain(false)
	})
	it('should return false if the password fails any of the validation tests', () => {
		const passwords = ['TestingPassword!!!', 'abcd1234', 'aBc3D4eFg', 'TESTING1']
		const validationResults = passwords.map((password) => passwordComplexity.validatePassword(password, configuration))

		expect(validationResults).not.toContain(true)
	})
})
