export interface GrantType {
	name: string
	id: string
	hidden?: boolean
}

export const GrantTypes = {
	AuthorizationCode: {
		id: 'authorization_code',
		name: 'Authorization Code'
	},
	RefreshToken: {
		id: 'refresh_token',
		name: 'Refresh Token'
	},
	Password: {
		id: 'password',
		name: 'Password'
	},
	MultifactorToken: {
		id: 'grayskull_mfa_token',
		name: 'Multifactor Token',
		hidden: true
	}
}
