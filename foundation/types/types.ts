export interface IAuthorizeClientResponse {
	pendingScopes: string[]
	redirectUri: string | null
}

export interface IClient {
	client_id: string
	name: string
	pinToHeader: boolean | null
	logoImageUrl: string | null
	description: string | null
	secret: string
	baseUrl: string
	homePageUrl: string | null
	redirectUris: string
	scopes: string
	AuthorizationFlows: string
	public: boolean | null
	isActive: boolean
	createdBy: string | null
	createdAt: Date
	updatedBy: string | null
	updatedAt: Date
	deletedBy: string | null
	deletedAt: Date | null
	TokenSigningMethod: string
}
export interface CreateClientOperationArgs {
	client_id: string
	name: string
	logoImageUrl: string | null
	pinToHeader: boolean | null
	description: string | null
	public: boolean | null
	secret: string
	baseUrl: string
	homePageUrl: string | null
	redirectUris: string
	scopes: string
	isActive: boolean
	TokenSigningMethod: string
}
export interface UpdateClientOperationArgs {
	client_id: string
	pinToHeader: boolean | null
	name: string | null
	logoImageUrl: string | null
	description: string | null
	public: boolean | null
	baseUrl: string | null
	homePageUrl: string | null
	redirectUris: string | null
	scopes: string | null
	isActive: boolean | null
	TokenSigningMethod: string
}

export interface IServerConfiguration {
	baseUrl: string | null
	realmName: string | null
	realmLogo: string | null
	realmBackground: string | null
	realmFavicon: string | null
}

export interface IMailConfiguration {
	serverAddress: string | null
	username: string | null
	password: string | null
	tlsSslRequired: boolean | null
	port: number | null
	fromAddress: string | null
	sendgridApiKey: string | null
}

export interface IUserClientMetadata {
	userClientId: string
	key: string
	value: string
}

export interface ISecurityConfiguration {
	maxLoginAttemptsPerMinute?: number | null
	maxPasswordAge?: number | null
	passwordRequiresLowercase?: boolean | null
	passwordRequiresUppercase?: boolean | null
	passwordRequiresNumber?: boolean | null
	passwordRequiresSymbol?: boolean | null
	passwordMinimumLength?: number | null
	multifactorRequired?: boolean | null
	requireEmailAddressVerification?: boolean | null
	passwordHistoryEnabled?: boolean | null
	passwordHistoryCount?: number | null
	invitationExpirationSeconds?: number | null
	accessTokenExpirationSeconds?: number | null
	domainWhitelist?: string | null
	allowSignup?: boolean | null
	allowSMSBackupCodes?: boolean | null
	twilioApiKey?: string | null
	twilioSID?: string | null
	smsFromNumber?: string | null
}

export interface IConfiguration {
	Security: ISecurityConfiguration
	Mail: IMailConfiguration
	Server: IServerConfiguration
	HeaderItems?: any
}
export interface SaveConfigurationOperationArgs {
	Security: ISecurityConfiguration
	Mail: IMailConfiguration
	Server: IServerConfiguration
}

export interface IEmailAddress {
	emailAddressId: string
	userAccountId: string
	emailAddress: string
	verified: boolean
	primary: boolean
	createdBy: string | null
	createdAt: Date
	updatedBy: string | null
	updatedAt: Date
	deletedBy: string | null
	deletedAt: Date | null
}
export interface SetEmailAddressPrimaryOperationArgs {
	emailAddressId: string
}
export interface AddEmailAddressOperationArgs {
	emailAddress: string
}
export interface SendVerificationOperationArgs {
	emailAddress: string
}

export interface IKeyValueCache {
	key: string
	value: string
	expires: Date
}

export interface ILoginResponse {
	success: boolean
	message?: string
	otpRequired?: boolean
	emailVerificationRequired?: boolean
}

export interface IOperationResponse {
	success: boolean
	error?: string
	message?: string
}

export interface IPhoneNumber {
	phoneNumberId: string
	userAccountId: string
	phoneNumber: string
	verified: boolean
	primary: boolean
	createdBy: string | null
	createdAt: Date
	updatedBy: string | null
	updatedAt: Date
	deletedBy: string | null
	deletedAt: Date | null
}

export interface IRefreshToken {
	id: string
	userClientId: string
	token: string
	scopes: string
	issuedAt: Date
	activeAt: Date
	expiresAt: Date | null
	revokedAt: Date | null
	createdBy: string | null
	updatedBy: string | null
	revokedBy: string | null
	deletedBy: string | null
	deletedAt: Date | null
}

export interface IRegisterUserResponse {
	success: boolean
	error?: string
	message?: string
}

export interface IScope {
	id: string
	clientDescription: string
	userDescription: string
	required: boolean
	permissionLevel: number
}

export interface ISession {
	sessionId: string
	userAccountId: string
	name: string | null
	ipAddress: string
	lastUsedAt: Date
	expiresAt: Date
	createdBy: string | null
	createdAt: Date
	updatedBy: string | null
	updatedAt: Date
}

export interface ISetting {
	key: string
	value: string
	type: string
	category: string
}

export interface IUploadFileResponse {
	url: string
	mimetype: string
	size: number
}

export interface IUserAccount {
	userAccountId: string
	firstName: string
	lastName: string
	displayName: string | null
	lastActive: Date
	lastPasswordChange: Date
	passwordHash: string
	gender: string | null
	birthday: Date | null
	profileImageUrl: string | null
	permissions: number
	otpSecret: string | null
	otpEnabled: boolean
	isActive: boolean
	createdBy: string | null
	createdAt: Date
	updatedBy: string | null
	updatedAt: Date
	deletedBy: string | null
	deletedAt: Date | null
	emailAddresses?: IEmailAddress[]
	password?: string
}
export interface UpdateClientScopesOperationArgs {
	client_id: string
	allowedScopes: string[]
	deniedScopes: string[]
}
export interface GenerateMfaKeyOperationArgs {
	emailAddress: string
}
export interface VerifyMfaKeyOperationArgs {
	secret: string
	token: string
}
export interface ResendVerificationOperationArgs {
	emailAddress: string
}
export interface ResendAllVerificationEmailsOperationArgs {
	dryRun: boolean | null
}

export interface ManualVerificationOperationArgs {
	emailAddress: string
}

export interface ResetPasswordOperationArgs {
	emailAddress: string
}
export interface ValidatePasswordOperationArgs {
	password: string
	confirm: string
}
export interface CreateUserOperationArgs {
	emailAddress: string
	firstName: string
	lastName: string
	permissions: number
	displayName: string | null
	gender: string | null
	birthday: Date | null
	profileImageUrl: string | null
}
export interface UpdateOperationArgs {
	userAccountId: string | null
	firstName: string | null
	lastName: string | null
	permissions: number | null
	displayName: string | null
	gender: string | null
	birthday: Date | null
	profileImageUrl: string | null
}
export interface LoginOperationArgs {
	emailAddress: string
	password: string
	otpToken: string | null
	extendedSession: boolean
}
export interface AuthorizeClientOperationArgs {
	client_id: string
	responseType: string
	redirectUri: string
	scope: string | null
	state: string | null
	nonce: string | null
}
export interface VerifyEmailAddressOperationArgs {
	emailAddress: string
	code: string
}
export interface ValidateResetPasswordTokenOperationArgs {
	emailAddress: string
	token: string
}
export interface VerifyAuthorizationRequestOperationArgs {
	client_id: string
	redirect_uri: string
}
export interface SetOtpSecretOperationArgs {
	password: string
	otpSecret: string
}
export interface ChangePasswordOperationArgs {
	emailAddress: string | null
	oldPassword: string | null
	newPassword: string
	confirmPassword: string
	token: string | null
}
export interface DeleteAccountOperationArgs {
	userAccountId: string
}
export interface ActivateAccountOperationArgs {
	emailAddress: string
	token: string
	password: string
	confirmPassword: string
	otpSecret: string | null
}
export interface RegisterUserOperationArgs {
	emailAddress: string
	password: string
	confirm: string
	client_id: string | null
	firstName: string
	lastName: string
	otpSecret: string | null
}

export interface IUserClient {
	userClientId: string
	userAccountId: string
	client_id: string
	allowedScopes: string
	deniedScopes: string
	revoked: boolean
	revokedBy: string | null
	RevokedAt: Date | null
	createdBy: string | null
	createdAt: Date
	updatedBy: string | null
	updatedAt: Date
	deletedBy: string | null
	deletedAt: Date | null
}
