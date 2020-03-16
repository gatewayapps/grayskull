export type OauthErrorTypes =
	| 'invalid_request'
	| 'invalid_client'
	| 'invalid_grant'
	| 'invalid_scope'
	| 'unauthorized_client'
	| 'unsupported_grant_type'

export interface IOauthError {
	error: OauthErrorTypes
	error_description: string
	error_uri?: string
}

export class OauthError implements IOauthError {
	constructor(error: OauthErrorTypes, description: string, uri?: string) {
		this.error = error
		this.error_description = description
		this.error_uri = uri
	}
	error: OauthErrorTypes
	error_description: string
	error_uri?: string | undefined
}
