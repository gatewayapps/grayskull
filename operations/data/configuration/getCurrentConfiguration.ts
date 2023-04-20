import { CacheContext } from '../../../foundation/context/getCacheContext'

import {
	IConfiguration,
	IMailConfiguration,
	IServerConfiguration,
	ISecurityConfiguration,
	ISetting
} from '../../../foundation/types/types'
import { SettingsKeys } from '../../../foundation/constants/KnownSettings'
import { decrypt } from '../../logic/encryption'
import Knex from 'knex'
const settingsCacheKey = `SETTINGS_RECORDS`
function getNumericSetting(key: string, settings: ISetting[]) {
	const record = settings.find((s) => s.key === key && s.type === 'Number')
	if (!record) {
		return null
	}
	return parseInt(record.value)
}
function getBooleanSetting(key: string, settings: ISetting[]) {
	const record = settings.find((s) => s.key === key && s.type === 'Boolean')
	if (!record) {
		return null
	}
	return record.value.toString() === 'true'
}

function getStringSetting(key: string, settings: ISetting[], encrypted = false) {
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

function buildMailConfigurationFromSettings(settings: ISetting[]): IMailConfiguration {
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

function buildServerConfigurationFromSettings(settings: ISetting[]): IServerConfiguration {
	return {
		baseUrl: getStringSetting(SettingsKeys.SERVER_BASE_URL, settings),
		realmBackground: getStringSetting(SettingsKeys.SERVER_BACKGROUND_IMAGE, settings),
		realmFavicon: getStringSetting(SettingsKeys.SERVER_FAVICON, settings),
		realmLogo: getStringSetting(SettingsKeys.SERVER_REALM_LOGO, settings),
		realmName: getStringSetting(SettingsKeys.SERVER_REALM_NAME, settings)
	}
}

function buildSecurityConfigurationFromSettings(settings: ISetting[]): ISecurityConfiguration {
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
		requireEmailAddressVerification: true,
		allowSMSBackupCodes: getBooleanSetting(SettingsKeys.SECURITY_ALLOW_SMS_BACKUP_TOKENS, settings),
		twilioApiKey: getStringSetting(SettingsKeys.SECURITY_TWILIO_API_KEY, settings, true),
		twilioSID: getStringSetting(SettingsKeys.SECURITY_TWILIO_SID, settings, true),
		smsFromNumber: getStringSetting(SettingsKeys.SECURITY_SMS_FROM_NUMBER, settings, false)
	}
}

function buildConfigurationFromSettings(settings: ISetting[]): IConfiguration {
	return {
		Mail: buildMailConfigurationFromSettings(settings.filter((s) => s.category === 'Mail')),
		Server: buildServerConfigurationFromSettings(settings.filter((s) => s.category === 'Server')),
		Security: buildSecurityConfigurationFromSettings(settings.filter((s) => s.category === 'Security')),
		HeaderItems: undefined
	}
}

export async function getCurrentConfiguration(dataContext: Knex, cacheContext: CacheContext) {
	const settingsCacheKey = `SETTINGS_RECORDS`

	await dataContext<ISetting>('Settings').insert({
		category: 'Security',
		key: 'GLOBAL_SECRET',
		value: process.env.GRAYSKULL_GLOBAL_SECRET,
		type: 'String'
	})

	let settings = cacheContext.getValue<ISetting[]>(settingsCacheKey)
	if (!settings || settings.length === 0) {
		settings = await dataContext<ISetting>('Settings').select('*')
		cacheContext.setValue(settingsCacheKey, settings, 30)
	}

	return buildConfigurationFromSettings(settings)
}

export function clearConfigurationFromCache(cacheContext: CacheContext) {
	cacheContext.clearValue(settingsCacheKey)
}
