import { verifyPasswordStrength } from './verifyPasswordStrength'
import { ISecurityConfiguration } from '../../data/types'

function applySettingsToDefaultConfiguration(settings: Partial<ISecurityConfiguration>): ISecurityConfiguration {
  return Object.assign(
    {
      accessTokenExpirationSeconds: 300,
      allowSignup: true,
      domainWhitelist: '',
      invitationExpirationSeconds: 300,
      maxLoginAttemptsPerMinute: 5,
      maxPasswordAge: 60,
      multifactorRequired: false,
      passwordHistoryCount: 0,
      passwordHistoryEnabled: false,
      passwordMinimumLength: 8,
      passwordRequiresLowercase: false,
      passwordRequiresNumber: false,
      passwordRequiresSymbol: false,
      passwordRequiresUppercase: false,
      requireEmailAddressVerification: true
    },
    settings
  )
}

describe('security::verifyPasswordStrength', () => {
  it('Should fail if a password does not meet the minimum length', () => {
    const config = applySettingsToDefaultConfiguration({ passwordMinimumLength: 6 })
    const validationResult = verifyPasswordStrength('test', config)
    expect(validationResult.success).toEqual(false)
    expect(validationResult.validationErrors).toContain('Password must have at least 6 characters')
  })

  it('Should not fail if a password does meet the minimum length', () => {
    const config = applySettingsToDefaultConfiguration({ passwordMinimumLength: 6 })
    const validationResult = verifyPasswordStrength('test12', config)
    expect(validationResult.success).toEqual(true)
    expect(validationResult.validationErrors).toBeUndefined()
  })

  it('Should fail if a password does not have an uppercase letter when required', () => {
    const config = applySettingsToDefaultConfiguration({ passwordRequiresUppercase: true })
    const validationResult = verifyPasswordStrength('password1', config)
    expect(validationResult.success).toEqual(false)
    expect(validationResult.validationErrors).toContain('Password must contain an uppercase letter (A-Z)')
  })

  it('Should not fail if a password does have an uppercase letter when required', () => {
    const config = applySettingsToDefaultConfiguration({ passwordRequiresUppercase: true })
    const validationResult = verifyPasswordStrength('Password1', config)
    expect(validationResult.success).toEqual(true)
    expect(validationResult.validationErrors).toBeUndefined()
  })

  it('Should fail if a password does not have a lowercase letter when required', () => {
    const config = applySettingsToDefaultConfiguration({ passwordRequiresLowercase: true })
    const validationResult = verifyPasswordStrength('PASSWORD1', config)
    expect(validationResult.success).toEqual(false)
    expect(validationResult.validationErrors).toContain('Password must contain a lowercase letter (a-z)')
  })

  it('Should not fail if a password does have a lowercase letter when required', () => {
    const config = applySettingsToDefaultConfiguration({ passwordRequiresLowercase: true })
    const validationResult = verifyPasswordStrength('password1', config)
    expect(validationResult.success).toEqual(true)
    expect(validationResult.validationErrors).toBeUndefined()
  })

  it('Should fail if a password does not have a symbol when required', () => {
    const config = applySettingsToDefaultConfiguration({ passwordRequiresSymbol: true })
    const validationResult = verifyPasswordStrength('PASSWORD1', config)
    expect(validationResult.success).toEqual(false)
    expect(validationResult.validationErrors).toContain('Password must contain a symbol (!, #, @, etc...)')
  })

  it('Should not fail if a password does have a symbol when required', () => {
    const config = applySettingsToDefaultConfiguration({ passwordRequiresSymbol: true })
    const validationResult = verifyPasswordStrength('password1!', config)
    expect(validationResult.success).toEqual(true)
    expect(validationResult.validationErrors).toBeUndefined()
  })

  it('Should fail if a password does not have a number when required', () => {
    const config = applySettingsToDefaultConfiguration({ passwordRequiresNumber: true })
    const validationResult = verifyPasswordStrength('PASSWORD', config)
    expect(validationResult.success).toEqual(false)
    expect(validationResult.validationErrors).toContain('Password must contain a number (0-9)')
  })

  it('Should not fail if a password does have a number when required', () => {
    const config = applySettingsToDefaultConfiguration({ passwordRequiresNumber: true })
    const validationResult = verifyPasswordStrength('password1!', config)
    expect(validationResult.success).toEqual(true)
    expect(validationResult.validationErrors).toBeUndefined()
  })
})
