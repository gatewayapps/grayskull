import Cors from 'cors'

import { getTokensFromAuthorizationCodeActivity } from '../../activities/tokens/getTokensFromAuthorizationCodeActivity'
import { getTokensFromMultifactorTokenActivity } from '../../activities/tokens/getTokensFromMultifactorTokenActivity'
import { getTokensFromRefreshTokenActivity } from '../../activities/tokens/getTokensFromRefreshTokenActivity'
import { getTokensFromPasswordActivity } from '../../activities/tokens/getTokensFromPasswordActivity'
import { getTokensFromClientCredentialsActivity } from '../../activities/tokens/getTokensFromClientCredentialsActivity'
import { NextApiRequest, NextApiResponse } from 'next'
import { prepareContext } from '../../foundation/context/prepareContext'
import { IAccessTokenResponse } from '../../foundation/types/tokens'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { OauthError } from '../../foundation/errors/OauthError'
import { GrantTypes } from '../../foundation/constants/grantTypes'
import { getClientCredentialsFromRequest } from '../../operations/logic/getClientCredentialsFromRequest'

function getMultifactorCredentialsFromRequest(req: NextApiRequest) {
	if (req.body && req.body.challenge_token && req.body.otp_token) {
		return {
			challenge_token: req.body.challenge_token,
			otp_token: req.body.otp_token
		}
	} else {
		return undefined
	}
}

function getLoginCredentialsFromRequest(req: NextApiRequest) {
	if (req.body && req.body.username) {
		const parsedScopes = decodeURIComponent(req.body.scope)
		const scope = parsedScopes.split(/[,\s]/)

		return {
			emailAddress: req.body.username,
			password: req.body.password,
			scope: scope
		}
	}
	return undefined
}

// Initializing the cors middleware
const cors = Cors({
	methods: ['GET', 'HEAD', 'OPTIONS', 'POST']
})

function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result)
			}

			return resolve(result)
		})
	})
}

export default async function handleTokenRequest(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors)
	const context = await prepareContext(req, res)

	if (req.method !== 'POST') {
		res.status(405).json({ success: false, message: 'Method not allowed' })
		return
	}
	try {
		const clientCredentials = getClientCredentialsFromRequest(context.req)
		const body = context.req.body

		if (!body || !body.grant_type || !clientCredentials) {
			res.status(400).json(new OauthError('invalid_request', 'No request body was sent'))
			return
		}

		let accessTokenResponse: IAccessTokenResponse | undefined = undefined
		const scope = body.scope || body.scopes
		switch (body.grant_type) {
			case GrantTypes.AuthorizationCode.id: {
				accessTokenResponse = await getTokensFromAuthorizationCodeActivity(
					clientCredentials.client_id,
					clientCredentials.client_secret,
					body.code,
					context
				)
				break
			}
			case GrantTypes.RefreshToken.id: {
				accessTokenResponse = await getTokensFromRefreshTokenActivity(
					clientCredentials.client_id,
					clientCredentials.client_secret,
					body.refresh_token,
					context
				)
				break
			}
			case GrantTypes.Password.id: {
				const loginCredentials = getLoginCredentialsFromRequest(context.req)
				if (!loginCredentials) {
					throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'Invalid username or password')
				}
				accessTokenResponse = await getTokensFromPasswordActivity(
					clientCredentials.client_id,
					loginCredentials.emailAddress,
					loginCredentials.password,
					scope,
					context
				)
				break
			}
			case GrantTypes.MultifactorToken.id: {
				const mfaCredentials = getMultifactorCredentialsFromRequest(context.req)
				if (!mfaCredentials) {
					throw new GrayskullError(GrayskullErrorCode.InvalidOTP, 'otp_token and challenge_token are required')
				}
				accessTokenResponse = await getTokensFromMultifactorTokenActivity(
					clientCredentials.client_id,
					mfaCredentials.otp_token,
					mfaCredentials.challenge_token,
					context
				)
				break
			}
			case GrantTypes.ClientCredentials.id: {
				accessTokenResponse = await getTokensFromClientCredentialsActivity(
					clientCredentials.client_id,
					clientCredentials.client_secret,
					context
				)
				break
			}
			default: {
				res.status(400).json(new OauthError('unsupported_grant_type', `Grant type '${body.grant_type}'`))
				return
			}
		}
		res.status(200).json(accessTokenResponse)
	} catch (err) {
		if (err instanceof GrayskullError) {
			switch (err.code) {
				case GrayskullErrorCode.InvalidClientId: {
					res.status(400).json(new OauthError('invalid_client', 'Client credentials were not valid'))
					return
				}
				case GrayskullErrorCode.NotAuthorized: {
					res.status(400).json(new OauthError('unauthorized_client', 'Failed to authorize'))
					return
				}
				case GrayskullErrorCode.InvalidOTP: {
					res.status(400).json(new OauthError('invalid_request', 'Failed to verify multifactor_token'))
					break
				}
			}
		}
		res.status(400).json(new OauthError('invalid_request', err.message))
		return
	}
}
