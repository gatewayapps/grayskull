export interface IClientMeta {
	count: number
}

export interface IClientFilter {
	or?: IClientFilter[]
	and?: IClientFilter[]
	client_id_contains?: string
	client_id_startsWith?: string
	client_id_endsWith?: string
	client_id_equals?: string
	client_id_notEquals?: string
	client_id_in?: string[]
	name_contains?: string
	name_startsWith?: string
	name_endsWith?: string
	name_equals?: string
	name_notEquals?: string
	logoImageUrl_contains?: string
	logoImageUrl_startsWith?: string
	logoImageUrl_endsWith?: string
	logoImageUrl_equals?: string
	logoImageUrl_notEquals?: string
	description_contains?: string
	description_startsWith?: string
	description_endsWith?: string
	description_equals?: string
	description_notEquals?: string
	baseUrl_contains?: string
	baseUrl_startsWith?: string
	baseUrl_endsWith?: string
	baseUrl_equals?: string
	baseUrl_notEquals?: string
	homePageUrl_contains?: string
	homePageUrl_startsWith?: string
	homePageUrl_endsWith?: string
	homePageUrl_equals?: string
	homePageUrl_notEquals?: string
	redirectUris_contains?: string
	redirectUris_startsWith?: string
	redirectUris_endsWith?: string
	redirectUris_equals?: string
	redirectUris_notEquals?: string
	scopes_contains?: string
	scopes_startsWith?: string
	scopes_endsWith?: string
	scopes_equals?: string
	scopes_notEquals?: string
	public_equals?: boolean
	public_notEquals?: boolean
	isActive_equals?: boolean
	isActive_notEquals?: boolean
	pinToHeader_equals?: boolean
	pinToHeader_notEquals?: boolean
	createdBy_in?: string[]
	createdBy_equals?: string
	createdBy_notEquals?: string
	createdAt_lessThan?: Date
	createdAt_greaterThan?: Date
	createdAt_equals?: Date
	createdAt_notEquals?: Date
	updatedBy_in?: string[]
	updatedBy_equals?: string
	updatedBy_notEquals?: string
	updatedAt_lessThan?: Date
	updatedAt_greaterThan?: Date
	updatedAt_equals?: Date
	updatedAt_notEquals?: Date
	deletedBy_in?: string[]
	deletedBy_equals?: string
	deletedBy_notEquals?: string
	deletedAt_lessThan?: Date
	deletedAt_greaterThan?: Date
	deletedAt_equals?: Date
	deletedAt_notEquals?: Date
}

export interface IClientUniqueFilter {
	client_id?: string
}

export interface IConfigurationMeta {
	count: number
}

export interface IConfigurationFilter {
	or?: IConfigurationFilter[]
	and?: IConfigurationFilter[]
}

export interface IEmailAddressMeta {
	count: number
}

export interface IEmailAddressFilter {
	or?: IEmailAddressFilter[]
	and?: IEmailAddressFilter[]
	emailAddressId_in?: string[]
	emailAddressId_equals?: string
	emailAddressId_notEquals?: string
	userAccountId_in?: string[]
	userAccountId_equals?: string
	userAccountId_notEquals?: string
	emailAddress_contains?: string
	emailAddress_startsWith?: string
	emailAddress_endsWith?: string
	emailAddress_equals?: string
	emailAddress_notEquals?: string
	verified_equals?: boolean
	verified_notEquals?: boolean
	primary_equals?: boolean
	primary_notEquals?: boolean
	createdBy_in?: string[]
	createdBy_equals?: string
	createdBy_notEquals?: string
	createdAt_lessThan?: Date
	createdAt_greaterThan?: Date
	createdAt_equals?: Date
	createdAt_notEquals?: Date
	updatedBy_in?: string[]
	updatedBy_equals?: string
	updatedBy_notEquals?: string
	updatedAt_lessThan?: Date
	updatedAt_greaterThan?: Date
	updatedAt_equals?: Date
	updatedAt_notEquals?: Date
	deletedBy_in?: string[]
	deletedBy_equals?: string
	deletedBy_notEquals?: string
	deletedAt_lessThan?: Date
	deletedAt_greaterThan?: Date
	deletedAt_equals?: Date
	deletedAt_notEquals?: Date
}

export interface IEmailAddressUniqueFilter {
	emailAddressId?: string
	emailAddress?: string
}

export interface IPhoneNumberMeta {
	count: number
}

export interface IPhoneNumberFilter {
	or?: IPhoneNumberFilter[]
	and?: IPhoneNumberFilter[]
	phoneNumberId_in?: string[]
	phoneNumberId_equals?: string
	phoneNumberId_notEquals?: string
	userAccountId_in?: string[]
	userAccountId_equals?: string
	userAccountId_notEquals?: string
	phoneNumber_contains?: string
	phoneNumber_startsWith?: string
	phoneNumber_endsWith?: string
	phoneNumber_equals?: string
	phoneNumber_notEquals?: string
	verified_equals?: boolean
	verified_notEquals?: boolean
	primary_equals?: boolean
	primary_notEquals?: boolean
	createdBy_in?: string[]
	createdBy_equals?: string
	createdBy_notEquals?: string
	createdAt_lessThan?: Date
	createdAt_greaterThan?: Date
	createdAt_equals?: Date
	createdAt_notEquals?: Date
	updatedBy_in?: string[]
	updatedBy_equals?: string
	updatedBy_notEquals?: string
	updatedAt_lessThan?: Date
	updatedAt_greaterThan?: Date
	updatedAt_equals?: Date
	updatedAt_notEquals?: Date
	deletedBy_in?: string[]
	deletedBy_equals?: string
	deletedBy_notEquals?: string
	deletedAt_lessThan?: Date
	deletedAt_greaterThan?: Date
	deletedAt_equals?: Date
	deletedAt_notEquals?: Date
}

export interface IPhoneNumberUniqueFilter {
	phoneNumberId?: string
	phoneNumber?: string
}

export interface IRefreshTokenMeta {
	count: number
}

export interface IRefreshTokenFilter {
	or?: IRefreshTokenFilter[]
	and?: IRefreshTokenFilter[]
	id_in?: string[]
	id_equals?: string
	id_notEquals?: string
	userClientId_in?: string[]
	userClientId_equals?: string
	userClientId_notEquals?: string
	token_contains?: string
	token_startsWith?: string
	token_endsWith?: string
	token_equals?: string
	token_notEquals?: string
	issuedAt_lessThan?: Date
	issuedAt_greaterThan?: Date
	issuedAt_equals?: Date
	issuedAt_notEquals?: Date
	activeAt_lessThan?: Date
	activeAt_greaterThan?: Date
	activeAt_equals?: Date
	activeAt_notEquals?: Date
	expiresAt_lessThan?: Date
	expiresAt_greaterThan?: Date
	expiresAt_equals?: Date
	expiresAt_notEquals?: Date
	revokedAt_lessThan?: Date
	revokedAt_greaterThan?: Date
	revokedAt_equals?: Date
	revokedAt_notEquals?: Date
	createdBy_in?: string[]
	createdBy_equals?: string
	createdBy_notEquals?: string
	updatedBy_in?: string[]
	updatedBy_equals?: string
	updatedBy_notEquals?: string
	revokedBy_in?: string[]
	revokedBy_equals?: string
	revokedBy_notEquals?: string
	deletedBy_in?: string[]
	deletedBy_equals?: string
	deletedBy_notEquals?: string
	deletedAt_lessThan?: Date
	deletedAt_greaterThan?: Date
	deletedAt_equals?: Date
	deletedAt_notEquals?: Date
}

export interface IRefreshTokenUniqueFilter {
	id?: string
	token?: string
}

export interface SessionMeta {
	count: number
}

export interface SessionFilter {
	or?: SessionFilter[]
	and?: SessionFilter[]
	sessionId_in?: string[]
	sessionId_equals?: string
	sessionId_notEquals?: string
	userAccountId_in?: string[]
	userAccountId_equals?: string
	userAccountId_notEquals?: string
	name_contains?: string
	name_startsWith?: string
	name_endsWith?: string
	name_equals?: string
	name_notEquals?: string
	ipAddress_contains?: string
	ipAddress_startsWith?: string
	ipAddress_endsWith?: string
	ipAddress_equals?: string
	ipAddress_notEquals?: string
	lastUsedAt_lessThan?: Date
	lastUsedAt_greaterThan?: Date
	lastUsedAt_equals?: Date
	lastUsedAt_notEquals?: Date
	expiresAt_lessThan?: Date
	expiresAt_greaterThan?: Date
	expiresAt_equals?: Date
	expiresAt_notEquals?: Date
	createdBy_in?: string[]
	createdBy_equals?: string
	createdBy_notEquals?: string
	createdAt_lessThan?: Date
	createdAt_greaterThan?: Date
	createdAt_equals?: Date
	createdAt_notEquals?: Date
	updatedBy_in?: string[]
	updatedBy_equals?: string
	updatedBy_notEquals?: string
	updatedAt_lessThan?: Date
	updatedAt_greaterThan?: Date
	updatedAt_equals?: Date
	updatedAt_notEquals?: Date
}

export interface SessionUniqueFilter {
	sessionId?: string
}

export interface ISettingMeta {
	count: number
}

export interface ISettingFilter {
	or?: ISettingFilter[]
	and?: ISettingFilter[]
	key_contains?: string
	key_startsWith?: string
	key_endsWith?: string
	key_equals?: string
	key_notEquals?: string
	value_contains?: string
	value_startsWith?: string
	value_endsWith?: string
	value_equals?: string
	value_notEquals?: string
	type_contains?: string
	type_startsWith?: string
	type_endsWith?: string
	type_equals?: string
	type_notEquals?: string
	category_contains?: string
	category_startsWith?: string
	category_endsWith?: string
	category_equals?: string
	category_notEquals?: string
}

export interface ISettingUniqueFilter {
	key?: string
}

export interface UserAccountMeta {
	count: number
}

export interface UserAccountFilter {
	or?: UserAccountFilter[]
	and?: UserAccountFilter[]
	userAccountId_in?: string[]
	userAccountId_equals?: string
	userAccountId_notEquals?: string
	firstName_contains?: string
	firstName_startsWith?: string
	firstName_endsWith?: string
	firstName_equals?: string
	firstName_notEquals?: string
	lastName_contains?: string
	lastName_startsWith?: string
	lastName_endsWith?: string
	lastName_equals?: string
	lastName_notEquals?: string
	displayName_contains?: string
	displayName_startsWith?: string
	displayName_endsWith?: string
	displayName_equals?: string
	displayName_notEquals?: string
	lastActive_lessThan?: Date
	lastActive_greaterThan?: Date
	lastActive_equals?: Date
	lastActive_notEquals?: Date
	lastPasswordChange_lessThan?: Date
	lastPasswordChange_greaterThan?: Date
	lastPasswordChange_equals?: Date
	lastPasswordChange_notEquals?: Date
	gender_contains?: string
	gender_startsWith?: string
	gender_endsWith?: string
	gender_equals?: string
	gender_notEquals?: string
	birthday_lessThan?: Date
	birthday_greaterThan?: Date
	birthday_equals?: Date
	birthday_notEquals?: Date
	profileImageUrl_contains?: string
	profileImageUrl_startsWith?: string
	profileImageUrl_endsWith?: string
	profileImageUrl_equals?: string
	profileImageUrl_notEquals?: string
	permissions_lessThan?: number
	permissions_greaterThan?: number
	permissions_equals?: number
	permissions_notEquals?: number
	otpEnabled_equals?: boolean
	otpEnabled_notEquals?: boolean
	isActive_equals?: boolean
	isActive_notEquals?: boolean
	createdBy_in?: string[]
	createdBy_equals?: string
	createdBy_notEquals?: string
	createdAt_lessThan?: Date
	createdAt_greaterThan?: Date
	createdAt_equals?: Date
	createdAt_notEquals?: Date
	updatedBy_in?: string[]
	updatedBy_equals?: string
	updatedBy_notEquals?: string
	updatedAt_lessThan?: Date
	updatedAt_greaterThan?: Date
	updatedAt_equals?: Date
	updatedAt_notEquals?: Date
	deletedBy_in?: string[]
	deletedBy_equals?: string
	deletedBy_notEquals?: string
	deletedAt_lessThan?: Date
	deletedAt_greaterThan?: Date
	deletedAt_equals?: Date
	deletedAt_notEquals?: Date
}

export interface UserAccountUniqueFilter {
	userAccountId?: string
}

export interface IUserClientMeta {
	count: number
}

export interface IUserClientFilter {
	or?: IUserClientFilter[]
	and?: IUserClientFilter[]
	userClientId_in?: string[]
	userClientId_equals?: string
	userClientId_notEquals?: string
	userAccountId_in?: string[]
	userAccountId_equals?: string
	userAccountId_notEquals?: string
	client_id_contains?: string
	client_id_startsWith?: string
	client_id_endsWith?: string
	client_id_equals?: string
	client_id_notEquals?: string
	allowedScopes_contains?: string
	allowedScopes_startsWith?: string
	allowedScopes_endsWith?: string
	allowedScopes_equals?: string
	allowedScopes_notEquals?: string
	deniedScopes_contains?: string
	deniedScopes_startsWith?: string
	deniedScopes_endsWith?: string
	deniedScopes_equals?: string
	deniedScopes_notEquals?: string
	revoked_equals?: boolean
	revoked_notEquals?: boolean
	revokedBy_in?: string[]
	revokedBy_equals?: string
	revokedBy_notEquals?: string
	RevokedAt_lessThan?: Date
	RevokedAt_greaterThan?: Date
	RevokedAt_equals?: Date
	RevokedAt_notEquals?: Date
	createdBy_in?: string[]
	createdBy_equals?: string
	createdBy_notEquals?: string
	createdAt_lessThan?: Date
	createdAt_greaterThan?: Date
	createdAt_equals?: Date
	createdAt_notEquals?: Date
	updatedBy_in?: string[]
	updatedBy_equals?: string
	updatedBy_notEquals?: string
	updatedAt_lessThan?: Date
	updatedAt_greaterThan?: Date
	updatedAt_equals?: Date
	updatedAt_notEquals?: Date
	deletedBy_in?: string[]
	deletedBy_equals?: string
	deletedBy_notEquals?: string
	deletedAt_lessThan?: Date
	deletedAt_greaterThan?: Date
	deletedAt_equals?: Date
	deletedAt_notEquals?: Date
}

export interface IUserClientUniqueFilter {
	userClientId?: string
	userAccountId?: string
	client_id?: string
}
