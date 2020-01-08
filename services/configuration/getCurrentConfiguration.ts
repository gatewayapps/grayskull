import { DataContext } from '../../context/getDataContext'
import { CacheContext } from '../../context/getCacheContext'
import { Setting } from '../../server/data/models/Setting'
import { IConfiguration, IMailConfiguration, IServerConfiguration, ISecurityConfiguration } from '../../data/types'
import { SettingsKeys } from '../../server/config/KnownSettings'
import { decrypt } from '../../server/utils/cipher'
const settingsCacheKey = `SETTINGS_RECORDS`
function getNumericSetting(key: string, settings: Setting[]) {
  const record = settings.find((s) => s.key === key && s.type === 'Number')
  if (!record) {
    return null
  }
  return parseInt(record.value)
}
function getBooleanSetting(key: string, settings: Setting[]) {
  const record = settings.find((s) => s.key === key && s.type === 'Boolean')
  if (!record) {
    return null
  }
  return record.value.toString() === 'true'
}

function getStringSetting(key: string, settings: Setting[], encrypted = false) {
  const record = settings.find((s) => s.key === key && s.type === 'String')
  if (!record) {
    return null
  }
  if (encrypted) {
    return decrypt(record.value)
  } else {
    return record.value
  }
}

function buildMailConfigurationFromSettings(settings: Setting[]): IMailConfiguration {
  return {
    fromAddress: getStringSetting(SettingsKeys.MAIL_FROM_ADDRESS, settings),
    password: getStringSetting(SettingsKeys.MAIL_PASSWORD, settings, true),
    port: getNumericSetting(SettingsKeys.MAIL_PORT, settings),
    username: getStringSetting(SettingsKeys.MAIL_USER, settings),
    serverAddress: getStringSetting(SettingsKeys.MAIL_HOST, settings),
    tlsSslRequired: getBooleanSetting(SettingsKeys.MAIL_SSL, settings),
    sendgridApiKey: getStringSetting(SettingsKeys.MAIL_SENDGRID_API_KEY, settings, true)
  }
}

function buildServerConfigurationFromSettings(settings: Setting[]): IServerConfiguration {
  return {
    baseUrl: getStringSetting(SettingsKeys.SERVER_BASE_URL, settings),
    realmBackground: getStringSetting(SettingsKeys.SERVER_BACKGROUND_IMAGE, settings),
    realmFavicon: getStringSetting(SettingsKeys.SERVER_FAVICON, settings),
    realmLogo: getStringSetting(SettingsKeys.SERVER_REALM_LOGO, settings),
    realmName: getStringSetting(SettingsKeys.SERVER_REALM_NAME, settings)
  }
}

function buildSecurityConfigurationFromSettings(settings: Setting[]): ISecurityConfiguration {
  return {
    accessTokenExpirationSeconds: getNumericSetting(SettingsKeys.SECURITY_ACCESS_TOKEN_EXPIRES_IN_SECONDS, settings),
    allowSignup: getBooleanSetting(SettingsKeys.SECURITY_ALLOW_USER_SIGNUP, settings),
    domainWhitelist: getStringSetting(SettingsKeys.SECURITY_DOMAIN_WHITELIST, settings),
    invitationExpirationSeconds: getNumericSetting(SettingsKeys.SECURITY_ACTIVATION_EXPIRES_IN_MINUTES, settings),
    maxLoginAttemptsPerMinute: getNumericSetting(SettingsKeys.SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE, settings),
    maxPasswordAge: getNumericSetting(SettingsKeys.SECURITY_PASSWORD_EXPIRES_DAYS, settings),
    multifactorRequired: getBooleanSetting(SettingsKeys.SECURITY_MULTIFACTOR_REQUIRED, settings),
    passwordHistoryCount: 1,
    passwordHistoryEnabled: false,
    passwordMinimumLength: getNumericSetting(SettingsKeys.SECURITY_PASSWORD_MINIMUM_LENGTH, settings),
    passwordRequiresLowercase: getBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_LOWERCASE, settings),
    passwordRequiresNumber: getBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_NUMBER, settings),
    passwordRequiresSymbol: getBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_SYMBOL, settings),
    passwordRequiresUppercase: getBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_UPPERCASE, settings),
    requireEmailAddressVerification: true
  }
}

function buildConfigurationFromSettings(settings: Setting[]): IConfiguration {
  return {
    Mail: buildMailConfigurationFromSettings(settings.filter((s) => s.category === 'Mail')),
    Server: buildServerConfigurationFromSettings(settings.filter((s) => s.category === 'Server')),
    Security: buildSecurityConfigurationFromSettings(settings.filter((s) => s.category === 'Security')),
    HeaderItems: undefined
  }
}

export async function getCurrentConfiguration(dataContext: DataContext, cacheContext: CacheContext) {
  const settingsCacheKey = `SETTINGS_RECORDS`

  let settings = cacheContext.getValue<Setting[]>(settingsCacheKey)
  if (!settings || settings.length === 0) {
    settings = await dataContext.Setting.findAll()
    cacheContext.setValue(settingsCacheKey, settings, 30)
  }

  return buildConfigurationFromSettings(settings)
}

export function clearConfigurationFromCache(cacheContext: CacheContext) {
  cacheContext.clearValue(settingsCacheKey)
}
