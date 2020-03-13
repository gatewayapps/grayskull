export interface IAccessToken {
	id?: string
	sub: string
	scopes: string[]
	exp: number
}

export interface ISubject {
	sub: string
}

export interface IIDToken extends ISubject {
	iss: string
	at_hash: string | undefined
	aud: string
	exp: number
	iat: number
	nonce?: string
}

export interface IProfileClaim {
	name?: string
	given_name?: string
	family_name?: string
	nickname?: string | null
	profile?: string
	picture?: string | null
	updated_at?: number
}

export interface IEmailClaim {
	email?: string
	email_verified?: boolean
}

export interface IChallenge {
	type: string
	token: string
}

export interface IChallengeToken {
	userClientId: string
	scopes: string[]
	iat: Date //Issued At
}

export interface IAccessTokenResponse {
	challenge?: IChallenge
	token_type?: string
	id_token?: string
	expires_in?: number
	access_token?: string
	refresh_token?: string
	session_id?: string
}
export type GrantType = 'authorization_code' | 'refresh_token'
