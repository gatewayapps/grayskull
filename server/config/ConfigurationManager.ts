import { config } from 'dotenv'

import { ISecurityConfiguration } from '../data/models/ISecurityConfiguration'
import { IServerConfiguration } from '../data/models/IServerConfiguration'
import { IMailConfiguration } from '../data/models/IMailConfiguration'
import { IConfiguration } from '../data/models/IConfiguration'
import { getContext } from '../data/context'
import { SettingsKeys } from './KnownSettings'

config()
let currentConfig: IConfiguration

currentConfig = {}

export function getCurrentConfiguration(): IConfiguration {
  return currentConfig
}
class ConfigurationManager {
  private async loadConfigurationAsync() {
    const context = await getContext()
    const settings = await context.Setting.findAll()

    let mailConfig: IMailConfiguration = {}
    let serverConfig: IServerConfiguration = {}
    let securityConfig: ISecurityConfiguration = {}

    settings.forEach((s) => {
      switch (s.key) {
        case SettingsKeys.MAIL_FROM_ADDRESS: {
          mailConfig.fromAddress = s.value
          break
        }
        case SettingsKeys.MAIL_HOST: {
          mailConfig.serverAddress = s.value
          break
        }
        case SettingsKeys.MAIL_PASSWORD: {
          mailConfig.password = s.value
          break
        }
        case SettingsKeys.MAIL_PORT: {
          mailConfig.port = parseInt(s.value)
          break
        }
        case SettingsKeys.MAIL_SSL: {
          mailConfig.tlsSslRequired = !!s.value
          break
        }
        case SettingsKeys.MAIL_USER: {
          mailConfig.username = s.value
          break
        }
        case SettingsKeys.SECURITY_ACTIVATION_EXPIRES_IN_MINUTES: {
          securityConfig.invitationExpirationSeconds = parseInt(s.value) * 60
          break
        }
        case SettingsKeys.SECURITY_ALLOW_USER_SIGNUP: {
          securityConfig.allowSignup = !!s.value
          break
        }
        case SettingsKeys.SECURITY_DOMAIN_WHITELIST: {
          securityConfig.domainWhitelist = s.value
          break
        }
        case SettingsKeys.SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE: {
          securityConfig.maxLoginAttemptsPerMinute = parseInt(s.value)
          break
        }
        case SettingsKeys.SECURITY_MULTIFACTOR_REQUIRED: {
          securityConfig.multifactorRequired = !!s.value
          break
        }
        case SettingsKeys.SECURITY_PASSWORD_EXPIRES_DAYS: {
          securityConfig.maxPasswordAge = parseInt(s.value)
          break
        }
        case SettingsKeys.SECURITY_PASSWORD_MINIMUM_LENGTH: {
          securityConfig.passwordMinimumLength = parseInt(s.value)
          break
        }
        case SettingsKeys.SECURITY_PASSWORD_REQUIRES_LOWERCASE: {
          securityConfig.passwordRequiresLowercase = !!s.value
          break
        }
        case SettingsKeys.SECURITY_PASSWORD_REQUIRES_UPPERCASE: {
          securityConfig.passwordRequiresUppercase = !!s.value
          break
        }
        case SettingsKeys.SECURITY_PASSWORD_REQUIRES_NUMBER: {
          securityConfig.passwordRequiresNumber = !!s.value
          break
        }
        case SettingsKeys.SECURITY_PASSWORD_REQUIRES_SYMBOL: {
          securityConfig.passwordRequiresSymbol = !!s.value
          break
        }
        case SettingsKeys.SERVER_BASE_URL: {
          serverConfig.baseUrl = s.value
          break
        }
        case SettingsKeys.SERVER_REALM_LOGO: {
          serverConfig.realmLogo = s.value
          break
        }
        case SettingsKeys.SERVER_REALM_NAME: {
          serverConfig.realmName = s.value
          break
        }
      }
    })
    currentConfig = {
      Mail: mailConfig,
      Security: securityConfig,
      Server: serverConfig
    }
  }

  public async GetCurrentConfiguration(): Promise<IConfiguration | undefined> {
    if (!currentConfig) {
      await this.loadConfigurationAsync()
    }
    return currentConfig
  }
}

export default new ConfigurationManager()
