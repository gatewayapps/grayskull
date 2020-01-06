import { ISecurityConfiguration } from '../data/models/ISecurityConfiguration'
import { IServerConfiguration } from '../data/models/IServerConfiguration'
import { IMailConfiguration } from '../data/models/IMailConfiguration'
import { IConfiguration } from '../data/models/IConfiguration'

import { SettingsKeys } from './KnownSettings'
import SettingsService from '../api/services/SettingService'
import { decrypt, encrypt } from '../utils/cipher'
import { PASSWORD_PLACEHOLDER } from '../constants'

import moment from 'moment'

class ConfigurationManager {
  private currentConfig: IConfiguration = {}
  private expiresAt?: number

  public async loadConfigurationAsync() {
    if (this.expiresAt && this.expiresAt > new Date().getTime() && this.currentConfig.Server) {
      return this.currentConfig
    }

    const mailConfig: IMailConfiguration = {}
    const serverConfig: IServerConfiguration = {}
    const securityConfig: ISecurityConfiguration = {}

    await SettingsService.refreshSettings()

    mailConfig.fromAddress = await SettingsService.getStringSetting(SettingsKeys.MAIL_FROM_ADDRESS)
    mailConfig.serverAddress = await SettingsService.getStringSetting(SettingsKeys.MAIL_HOST)
    mailConfig.password = await SettingsService.getStringSetting(SettingsKeys.MAIL_PASSWORD)
    if (mailConfig.password) {
      mailConfig.password = decrypt(mailConfig.password)
    }
    mailConfig.sendgridApiKey = await SettingsService.getStringSetting(SettingsKeys.MAIL_SENDGRID_API_KEY)
    if (mailConfig.sendgridApiKey) {
      mailConfig.sendgridApiKey = decrypt(mailConfig.sendgridApiKey)
    }
    mailConfig.port = await SettingsService.getNumberSetting(SettingsKeys.MAIL_PORT)
    mailConfig.tlsSslRequired = await SettingsService.getBooleanSetting(SettingsKeys.MAIL_SSL)
    mailConfig.username = await SettingsService.getStringSetting(SettingsKeys.MAIL_USER)

    securityConfig.invitationExpirationSeconds = await SettingsService.getNumberSetting(
      SettingsKeys.SECURITY_ACTIVATION_EXPIRES_IN_MINUTES
    )
    securityConfig.allowSignup = await SettingsService.getBooleanSetting(SettingsKeys.SECURITY_ALLOW_USER_SIGNUP)
    securityConfig.domainWhitelist = await SettingsService.getStringSetting(SettingsKeys.SECURITY_DOMAIN_WHITELIST)

    securityConfig.maxLoginAttemptsPerMinute = await SettingsService.getNumberSetting(
      SettingsKeys.SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE
    )
    securityConfig.multifactorRequired = await SettingsService.getBooleanSetting(
      SettingsKeys.SECURITY_MULTIFACTOR_REQUIRED
    )
    securityConfig.maxPasswordAge = await SettingsService.getNumberSetting(SettingsKeys.SECURITY_PASSWORD_EXPIRES_DAYS)
    securityConfig.passwordMinimumLength = await SettingsService.getNumberSetting(
      SettingsKeys.SECURITY_PASSWORD_MINIMUM_LENGTH
    )
    securityConfig.passwordRequiresLowercase = await SettingsService.getBooleanSetting(
      SettingsKeys.SECURITY_PASSWORD_REQUIRES_LOWERCASE
    )
    securityConfig.passwordRequiresUppercase = await SettingsService.getBooleanSetting(
      SettingsKeys.SECURITY_PASSWORD_REQUIRES_UPPERCASE
    )
    securityConfig.passwordRequiresSymbol = await SettingsService.getBooleanSetting(
      SettingsKeys.SECURITY_PASSWORD_REQUIRES_SYMBOL
    )
    securityConfig.passwordRequiresNumber = await SettingsService.getBooleanSetting(
      SettingsKeys.SECURITY_PASSWORD_REQUIRES_NUMBER
    )
    securityConfig.accessTokenExpirationSeconds = await SettingsService.getNumberSetting(
      SettingsKeys.SECURITY_ACCESS_TOKEN_EXPIRES_IN_SECONDS
    )

    serverConfig.baseUrl = await SettingsService.getStringSetting(SettingsKeys.SERVER_BASE_URL)
    serverConfig.realmLogo = await SettingsService.getStringSetting(SettingsKeys.SERVER_REALM_LOGO)
    serverConfig.realmName = await SettingsService.getStringSetting(SettingsKeys.SERVER_REALM_NAME)
    serverConfig.realmBackground = await SettingsService.getStringSetting(SettingsKeys.SERVER_BACKGROUND_IMAGE)
    serverConfig.realmFavicon = (await SettingsService.getStringSetting(SettingsKeys.SERVER_FAVICON)) || '/favicon.ico'

    this.currentConfig = {
      Mail: mailConfig,
      Security: securityConfig,
      Server: serverConfig
    }

    this.expiresAt = moment()
      .add(5, 'seconds')
      .toDate()
      .getTime()

    return this.currentConfig
  }

  public async GetCurrentConfiguration(maskSensitive = true): Promise<IConfiguration> {
    const config = await this.loadConfigurationAsync()

    if (maskSensitive) {
      config.Mail!.password = PASSWORD_PLACEHOLDER
      config.Mail!.sendgridApiKey = PASSWORD_PLACEHOLDER
    }

    return config
  }
}

export default new ConfigurationManager()
