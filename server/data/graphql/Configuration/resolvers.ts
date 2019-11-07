import { SettingsKeys } from '../../../config/KnownSettings'
import { IConfiguration } from '../../models/IConfiguration'
import { saveStringSetting, saveNumberSetting, saveBooleanSetting } from '../../../api/services/SettingService'
import ConfigurationManager from '../../../config/ConfigurationManager'
import { encrypt } from '../../../utils/cipher'
import { PASSWORD_PLACEHOLDER } from '../../../constants'

export default {
  Query: {
    configuration: (obj, args, context, info) => {
      // Insert your configuration implementation here
      throw new Error('configuration is not implemented')
    }
  },
  Mutation: {
    saveConfiguration: async (obj, args, context, info) => {
      // Insert your saveConfiguration implementation here
      try {
        // we need to write all the configuration properties to the database
        const data = args.data as IConfiguration

        if (data.Server) {
          if (!!data.Server.baseUrl) {
            await saveStringSetting(SettingsKeys.SERVER_BASE_URL, data.Server!.baseUrl!, 'Server')
          }
          if (!!data.Server.realmLogo) {
            await saveStringSetting(SettingsKeys.SERVER_REALM_LOGO, data.Server!.realmLogo!, 'Server')
          }
          if (!!data.Server.realmName) {
            await saveStringSetting(SettingsKeys.SERVER_REALM_NAME, data.Server!.realmName!, 'Server')
          }
          if (!!data.Server.realmBackground) {
            await saveStringSetting(SettingsKeys.SERVER_BACKGROUND_IMAGE, data.Server!.realmBackground!, 'Server')
          }
        }

        if (data.Mail) {
          if (!!data.Mail.fromAddress) {
            await saveStringSetting(SettingsKeys.MAIL_FROM_ADDRESS, data.Mail.fromAddress!, 'Mail')
          }
          if (!!data.Mail.password && data.Mail.password !== PASSWORD_PLACEHOLDER) {
            await saveStringSetting(SettingsKeys.MAIL_PASSWORD, encrypt(data.Mail.password!), 'Mail')
          }
          if (!!data.Mail.port) {
            await saveNumberSetting(SettingsKeys.MAIL_PORT, data.Mail.port!, 'Mail')
          }
          if (!!data.Mail.serverAddress) {
            await saveStringSetting(SettingsKeys.MAIL_HOST, data.Mail.serverAddress!, 'Mail')
          }
          if (data.Mail.tlsSslRequired !== undefined && data.Mail.tlsSslRequired !== null) {
            await saveBooleanSetting(SettingsKeys.MAIL_SSL, !!data.Mail.tlsSslRequired!, 'Mail')
          }
          if (!!data.Mail.username) {
            await saveStringSetting(SettingsKeys.MAIL_USER, data.Mail.username!, 'Mail')
          }
        }

        if (data.Security) {
          if (!!data.Security.accessTokenExpirationSeconds) {
            await saveNumberSetting(SettingsKeys.SECURITY_ACCESS_TOKEN_EXPIRES_IN_SECONDS, data.Security.accessTokenExpirationSeconds!, 'Security')
          }
          if (data.Security.allowSignup !== undefined && data.Security.allowSignup !== null) {
            await saveBooleanSetting(SettingsKeys.SECURITY_ALLOW_USER_SIGNUP, !!data.Security.allowSignup, 'Security')
          }
          if (data.Security.domainWhitelist !== undefined && data.Security.domainWhitelist !== null) {
            await saveStringSetting(SettingsKeys.SECURITY_DOMAIN_WHITELIST, data.Security.domainWhitelist, 'Security')
          }
          if (data.Security.invitationExpirationSeconds !== undefined && data.Security.invitationExpirationSeconds !== null) {
            await saveNumberSetting(SettingsKeys.SECURITY_ACTIVATION_EXPIRES_IN_MINUTES, data.Security.invitationExpirationSeconds!, 'Security')
          }
          if (data.Security.maxLoginAttemptsPerMinute !== undefined && data.Security.maxLoginAttemptsPerMinute !== null) {
            await saveNumberSetting(SettingsKeys.SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE, data.Security.maxLoginAttemptsPerMinute, 'Security')
          }
          if (data.Security.maxPasswordAge !== undefined && data.Security.maxPasswordAge !== null) {
            await saveNumberSetting(SettingsKeys.SECURITY_PASSWORD_EXPIRES_DAYS, data.Security.maxPasswordAge, 'Security')
          }
          if (data.Security.multifactorRequired !== undefined && data.Security.multifactorRequired !== null) {
            await saveBooleanSetting(SettingsKeys.SECURITY_MULTIFACTOR_REQUIRED, !!data.Security.multifactorRequired, 'Security')
          }
          if (data.Security.passwordMinimumLength !== undefined && data.Security.passwordMinimumLength !== null) {
            await saveNumberSetting(SettingsKeys.SECURITY_PASSWORD_MINIMUM_LENGTH, data.Security.passwordMinimumLength, 'Security')
          }
          if (data.Security.passwordRequiresLowercase !== undefined && data.Security.passwordRequiresLowercase !== null) {
            await saveBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_LOWERCASE, !!data.Security.passwordRequiresLowercase, 'Security')
          }
          if (data.Security.passwordRequiresUppercase !== undefined && data.Security.passwordRequiresUppercase !== null) {
            await saveBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_UPPERCASE, !!data.Security.passwordRequiresUppercase, 'Security')
          }
          if (data.Security.passwordRequiresSymbol !== undefined && data.Security.passwordRequiresSymbol !== null) {
            await saveBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_SYMBOL, !!data.Security.passwordRequiresSymbol, 'Security')
          }
          if (data.Security.passwordRequiresNumber !== undefined && data.Security.passwordRequiresNumber !== null) {
            await saveBooleanSetting(SettingsKeys.SECURITY_PASSWORD_REQUIRES_NUMBER, !!data.Security.passwordRequiresNumber, 'Security')
          }
        }

        await ConfigurationManager.loadConfigurationAsync()

        return {
          success: true
        }
      } catch (err) {
        return {
          success: false,
          error: err.message
        }
      }
    },
    verifyCertbot: async (obj, args, context, info) => {
      try {
        return {
          success: true
        }
      } catch (err) {
        return {
          success: false,
          error: err.message
        }
      }
    }
  },
  Configuration: {}
}
