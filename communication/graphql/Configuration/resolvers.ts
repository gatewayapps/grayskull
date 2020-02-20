import { IConfiguration } from '../../../foundation/models/IConfiguration'

import { encrypt } from '../../../operations/logic/encryption'
import { PASSWORD_PLACEHOLDER } from '../../../foundation/constants'

import { Permissions } from '../../../foundation/constants/permissions'

import { IRequestContext } from '../../../foundation/context/prepareContext'
import { clearConfigurationFromCache } from '../../../operations/data/configuration/getCurrentConfiguration'
import { saveStringSetting, saveNumberSetting, saveBooleanSetting } from '../../../operations/data/setting/saveSetting'
import { SettingsKeys } from '../../../foundation/constants/KnownSettings'

export default {
	Query: {
		configuration: async (obj, args, context: IRequestContext) => {
			const user = context.user
			const loadMail = user && user.permissions === Permissions.Admin

			const configuration = context.configuration

			return {
				Server: configuration.Server,
				Security: configuration.Security,
				Mail: loadMail ? configuration.Mail : undefined
			}
		}
	},
	Mutation: {
		saveConfiguration: async (obj, args, context: IRequestContext) => {
			// Insert your saveConfiguration implementation here
			try {
				// we need to write all the configuration properties to the database
				const data = args.data as IConfiguration

				if (data.Server) {
					if (!!data.Server.baseUrl) {
						await saveStringSetting(SettingsKeys.SERVER_BASE_URL, data.Server.baseUrl, 'Server', context.dataContext)
					}
					if (!!data.Server.realmLogo) {
						await saveStringSetting(
							SettingsKeys.SERVER_REALM_LOGO,
							data.Server.realmLogo,
							'Server',
							context.dataContext
						)
					}
					if (!!data.Server.realmName) {
						await saveStringSetting(
							SettingsKeys.SERVER_REALM_NAME,
							data.Server.realmName,
							'Server',
							context.dataContext
						)
					}
					if (!!data.Server.realmBackground) {
						await saveStringSetting(
							SettingsKeys.SERVER_BACKGROUND_IMAGE,
							data.Server.realmBackground,
							'Server',
							context.dataContext
						)
					}
				}

				if (data.Mail) {
					if (!!data.Mail.fromAddress) {
						await saveStringSetting(SettingsKeys.MAIL_FROM_ADDRESS, data.Mail.fromAddress, 'Mail', context.dataContext)
					}
					if (!!data.Mail.password && data.Mail.password !== PASSWORD_PLACEHOLDER) {
						await saveStringSetting(
							SettingsKeys.MAIL_PASSWORD,
							encrypt(data.Mail.password),
							'Mail',
							context.dataContext
						)
					}
					if (!!data.Mail.port) {
						await saveNumberSetting(SettingsKeys.MAIL_PORT, data.Mail.port, 'Mail', context.dataContext)
					}
					if (!!data.Mail.serverAddress) {
						await saveStringSetting(SettingsKeys.MAIL_HOST, data.Mail.serverAddress, 'Mail', context.dataContext)
					}
					if (data.Mail.tlsSslRequired !== undefined && data.Mail.tlsSslRequired !== null) {
						await saveBooleanSetting(SettingsKeys.MAIL_SSL, !!data.Mail.tlsSslRequired, 'Mail', context.dataContext)
					}
					if (!!data.Mail.username) {
						await saveStringSetting(SettingsKeys.MAIL_USER, data.Mail.username, 'Mail', context.dataContext)
					}
					if (!!data.Mail.sendgridApiKey && data.Mail.sendgridApiKey !== PASSWORD_PLACEHOLDER) {
						await saveStringSetting(
							SettingsKeys.MAIL_SENDGRID_API_KEY,
							encrypt(data.Mail.sendgridApiKey),
							'Mail',
							context.dataContext
						)
					}
				}

				if (data.Security) {
					if (!!data.Security.accessTokenExpirationSeconds) {
						await saveNumberSetting(
							SettingsKeys.SECURITY_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
							data.Security.accessTokenExpirationSeconds,
							'Security',
							context.dataContext
						)
					}
					if (data.Security.allowSignup !== undefined && data.Security.allowSignup !== null) {
						await saveBooleanSetting(
							SettingsKeys.SECURITY_ALLOW_USER_SIGNUP,
							!!data.Security.allowSignup,
							'Security',
							context.dataContext
						)
					}
					if (data.Security.domainWhitelist !== undefined && data.Security.domainWhitelist !== null) {
						await saveStringSetting(
							SettingsKeys.SECURITY_DOMAIN_WHITELIST,
							data.Security.domainWhitelist,
							'Security',
							context.dataContext
						)
					}
					if (
						data.Security.invitationExpirationSeconds !== undefined &&
						data.Security.invitationExpirationSeconds !== null
					) {
						await saveNumberSetting(
							SettingsKeys.SECURITY_ACTIVATION_EXPIRES_IN_MINUTES,
							data.Security.invitationExpirationSeconds,
							'Security',
							context.dataContext
						)
					}
					if (
						data.Security.maxLoginAttemptsPerMinute !== undefined &&
						data.Security.maxLoginAttemptsPerMinute !== null
					) {
						await saveNumberSetting(
							SettingsKeys.SECURITY_MAX_LOGIN_ATTEMPTS_PER_MINUTE,
							data.Security.maxLoginAttemptsPerMinute,
							'Security',
							context.dataContext
						)
					}
					if (data.Security.maxPasswordAge !== undefined && data.Security.maxPasswordAge !== null) {
						await saveNumberSetting(
							SettingsKeys.SECURITY_PASSWORD_EXPIRES_DAYS,
							data.Security.maxPasswordAge,
							'Security',
							context.dataContext
						)
					}
					if (data.Security.multifactorRequired !== undefined && data.Security.multifactorRequired !== null) {
						await saveBooleanSetting(
							SettingsKeys.SECURITY_MULTIFACTOR_REQUIRED,
							!!data.Security.multifactorRequired,
							'Security',
							context.dataContext
						)
					}
					if (data.Security.passwordMinimumLength !== undefined && data.Security.passwordMinimumLength !== null) {
						await saveNumberSetting(
							SettingsKeys.SECURITY_PASSWORD_MINIMUM_LENGTH,
							data.Security.passwordMinimumLength,
							'Security',
							context.dataContext
						)
					}
					if (
						data.Security.passwordRequiresLowercase !== undefined &&
						data.Security.passwordRequiresLowercase !== null
					) {
						await saveBooleanSetting(
							SettingsKeys.SECURITY_PASSWORD_REQUIRES_LOWERCASE,
							!!data.Security.passwordRequiresLowercase,
							'Security',
							context.dataContext
						)
					}
					if (
						data.Security.passwordRequiresUppercase !== undefined &&
						data.Security.passwordRequiresUppercase !== null
					) {
						await saveBooleanSetting(
							SettingsKeys.SECURITY_PASSWORD_REQUIRES_UPPERCASE,
							!!data.Security.passwordRequiresUppercase,
							'Security',
							context.dataContext
						)
					}
					if (data.Security.passwordRequiresSymbol !== undefined && data.Security.passwordRequiresSymbol !== null) {
						await saveBooleanSetting(
							SettingsKeys.SECURITY_PASSWORD_REQUIRES_SYMBOL,
							!!data.Security.passwordRequiresSymbol,
							'Security',
							context.dataContext
						)
					}
					if (data.Security.passwordRequiresNumber !== undefined && data.Security.passwordRequiresNumber !== null) {
						await saveBooleanSetting(
							SettingsKeys.SECURITY_PASSWORD_REQUIRES_NUMBER,
							!!data.Security.passwordRequiresNumber,
							'Security',
							context.dataContext
						)
					}
					if (data.Security.allowSMSBackupCodes !== undefined && data.Security.allowSMSBackupCodes !== null) {
						await saveBooleanSetting(
							SettingsKeys.SECURITY_ALLOW_SMS_BACKUP_TOKENS,
							!!data.Security.allowSMSBackupCodes,
							'Security',
							context.dataContext
						)
						if (!!data.Security.allowSMSBackupCodes) {
							if (data.Security.twilioApiKey !== PASSWORD_PLACEHOLDER) {
								await saveStringSetting(
									SettingsKeys.SECURITY_TWILIO_API_KEY,
									encrypt(data.Security.twilioApiKey!),
									'Security',
									context.dataContext
								)
							}
							await saveStringSetting(
								SettingsKeys.SECURITY_SMS_FROM_NUMBER,
								data.Security.smsFromNumber!,
								'Security',
								context.dataContext
							)
						} else {
							await saveStringSetting(SettingsKeys.SECURITY_TWILIO_API_KEY, '', 'Security', context.dataContext)
							await saveStringSetting(SettingsKeys.SECURITY_SMS_FROM_NUMBER, '', 'Security', context.dataContext)
						}
					}
				}

				await saveBooleanSetting(SettingsKeys.SERVER_CONFIGURED, true, 'Server', context.dataContext)
				clearConfigurationFromCache(context.cacheContext)

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
