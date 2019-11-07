import { config } from 'dotenv'

import { ISecurityConfiguration } from '../data/models/ISecurityConfiguration'
import { IServerConfiguration } from '../data/models/IServerConfiguration'
import { IMailConfiguration } from '../data/models/IMailConfiguration'
import { IConfiguration } from '../data/models/IConfiguration'
import { getContext } from '../data/context'
import { SettingsKeys } from './KnownSettings'
import { getStringSetting, getNumberSetting, getBooleanSetting } from '../api/services/SettingService'
import { decrypt } from '../utils/cipher'
import { PASSWORD_PLACEHOLDER } from '../constants'

let currentConfig: IConfiguration

currentConfig = {}

class ConfigurationManager {
  public async loadConfigurationAsync() {
    config()
    const context = await getContext()
    const settings = await context.Setting.findAll()

    let mailConfig: IMailConfiguration = {}
    let serverConfig: IServerConfiguration = {}
    let securityConfig: ISecurityConfiguration = {}

    mailConfig.fromAddress = await getStringSetting(SettingsKeys.MAIL_FROM_ADDRESS)
    mailConfig.serverAddress = await getStringSetting(SettingsKeys.MAIL_HOST)
    mailConfig.password = await getStringSetting(SettingsKeys.MAIL_PASSWORD)
    if (mailConfig.password) {
      mailConfig.password = decrypt(mailConfig.password)
    }
    mailConfig.port = await getNumberSetting(SettingsKeys.MAIL_PORT)
    mailConfig.tlsSslRequired = await getBooleanSetting(SettingsKeys.MAIL_SSL)
    mailConfig.username = await getStringSetting(SettingsKeys.MAIL_USER)

    securityConfig.invitationExpirationSeconds = await getNumberSetting(SettingsKeys.SECURITY_ACTIVATION_EXPIRES_IN_MINUTES)
    securityConfig.allowSignup = await getBooleanSetting(SettingsKeys.SECURITY_ALLOW_USER_SIGNUP)
    securityConfig.domainWhitelist = await getStringSetting(SettingsKeys.SECURITY_DOMAIN_WHITELIST)

    securityConfig.maxLoginAttemptsPerMinute = await getNumberSetting(SettingsKeys.SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE)
    securityConfig.multifactorRequired = await getBooleanSetting(SettingsKeys.SECURITY_MULTIFACTOR_REQUIRED)
    securityConfig.maxPasswordAge = await getNumberSetting(SettingsKeys.SECURITY_PASSWORD_EXPIRES_DAYS)
    securityConfig.passwordMinimumLength = await getNumberSetting(SettingsKeys.SECURITY_PASSWORD_MINIMUM_LENGTH)
    securityConfig.passwordRequiresLowercase = await getBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_LOWERCASE)
    securityConfig.passwordRequiresUppercase = await getBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_UPPERCASE)
    securityConfig.passwordRequiresSymbol = await getBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_SYMBOL)
    securityConfig.passwordRequiresNumber = await getBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_NUMBER)
    securityConfig.accessTokenExpirationSeconds = await getNumberSetting(SettingsKeys.SECURITY_ACCESS_TOKEN_EXPIRES_IN_SECONDS)

    serverConfig.baseUrl = await getStringSetting(SettingsKeys.SERVER_BASE_URL)
    serverConfig.realmLogo = await getStringSetting(SettingsKeys.SERVER_REALM_LOGO)
    serverConfig.realmName = await getStringSetting(SettingsKeys.SERVER_REALM_NAME)

    currentConfig = {
      Mail: mailConfig,
      Security: securityConfig,
      Server: serverConfig
    }
  }

  public async GetCurrentConfiguration(): Promise<IConfiguration | undefined> {
    if (!currentConfig.Server) {
      await this.loadConfigurationAsync()
    }
    return currentConfig
  }
}

const singleton = new ConfigurationManager()

export async function getCurrentConfiguration(maskSensitive: boolean = true): Promise<IConfiguration> {
  if (!currentConfig.Server) {
    await singleton.GetCurrentConfiguration()
  }

  const config = Object.assign({}, currentConfig)

  if (!maskSensitive) {
    config.Mail!.password = PASSWORD_PLACEHOLDER
  }

  return config
}

export default singleton
