import { prepareContext } from '../../../foundation/context/prepareContext'
import { Scopes } from '../../../foundation/constants/scopes'
import { GrantTypeIds } from '../../../foundation/constants/grantTypes'
export default async (req, res) => {
	const context = await prepareContext(req, res)

	const issuer = context.configuration.Server.baseUrl
	const authorization_endpoint = new URL(`/authorize`, issuer).toString()
	const token_endpoint = new URL('/token', issuer).toString()
	const userinfo_endpoint = new URL('/userinfo', issuer).toString()
	// const revocation_endpoint -- needs to be implemented
	const jwks_uri = new URL('/.well-known/jwks.json', issuer)

	const response_types_supported = ['code', 'token', 'id_token']
	const subject_types_supported = ['public']

	const id_token_signing_alg_values_supported = ['RS256', 'HS256']
	const scopes_supported = Scopes.map((s) => s.id)
	const grant_types_supported = GrantTypeIds

	res.json({
		issuer,
		authorization_endpoint,
		token_endpoint,
		userinfo_endpoint,
		jwks_uri,
		response_types_supported,
		grant_types_supported,
		subject_types_supported,
		id_token_signing_alg_values_supported,
		scopes_supported
	})
}
