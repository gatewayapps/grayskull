export interface GrantType {
	name: string
	id: string
	hidden?: boolean
}

export const GrantTypes = {
	AuthorizationCode: {
		id: 'authorization_code',
		name: 'Authorization Code',
		hidden: false
	},
	ClientCredentials: {
		id: 'client_credentials',
		name: 'Client Credentials',
		hidden: false
	},
	RefreshToken: {
		id: 'refresh_token',
		name: 'Refresh Token',
		hidden: false
	},
	Password: {
		id: 'password',
		name: 'Password',
		hidden: false
	},
	MultifactorToken: {
		id: 'grayskull_mfa_token',
		name: 'Multifactor Token',
		hidden: true
	}
}

export const GrantTypeIds = [
	GrantTypes.AuthorizationCode.id,
	GrantTypes.ClientCredentials.id,
	GrantTypes.RefreshToken.id,
	GrantTypes.Password.id,
	GrantTypes.MultifactorToken.id
]
