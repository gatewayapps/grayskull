import { getTokensFromAuthorizationCodeActivity } from '../../activities/tokens/getTokensFromAuthorizationCodeActivity'
import { getTokensFromMultifactorTokenActivity } from '../../activities/tokens/getTokensFromMultifactorTokenActivity'
import { getTokensFromRefreshTokenActivity } from '../../activities/tokens/getTokensFromRefreshTokenActivity'
import { getTokensFromPasswordActivity } from '../../activities/tokens/getTokensFromPasswordActivity'
import { NextApiRequest, NextApiResponse } from 'next'
import { prepareContext } from '../../foundation/context/prepareContext'
import { IAccessTokenResponse } from '../../foundation/types/tokens'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { GrantTypes } from '../../foundation/constants/grantTypes'
function getClientCredentialsFromRequest(req: NextApiRequest) {
	if (req.headers.authorization) {
		const b64 = req.headers.authorization.replace('Basic ', '')
		const buf = Buffer.from(b64, 'base64')
		const stringContents = buf.toString('utf8')
		const authParts = stringContents.split(':')
		return {
			client_id: authParts[0],
			client_secret: authParts[1]
		}
	} else {
		if (req.body.client_id) {
			return {
				client_id: req.body.client_id,
				client_secret: req.body.client_secret
			}
		} else {
			return undefined
		}
	}
}

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

export default async function handleTokenRequest(req: NextApiRequest, res: NextApiResponse) {
	const context = await prepareContext(req, res)

	if (req.method !== 'POST') {
		res.status(405).json({ success: false, message: 'Method not allowed' })
		return
	}
	try {
		const clientCredentials = getClientCredentialsFromRequest(context.req)

		if (!req.body) {
			res.status(400).json({ success: false, message: 'Invalid request body' })
			return
		}
		const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body)

		if (!body || !body.grant_type || !clientCredentials) {
			res.statusCode = 400
			res.status(400).json({ success: false, message: 'Invalid request body' })
			return
		}

		let accessTokenResponse: IAccessTokenResponse | undefined = undefined
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
				const loginCredentials = getLoginCredentialsFromRequest(req)
				if (!loginCredentials) {
					throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'Invalid username or password')
				}
				accessTokenResponse = await getTokensFromPasswordActivity(
					clientCredentials.client_id,
					clientCredentials.client_secret,
					loginCredentials.emailAddress,
					loginCredentials.password,
					loginCredentials.scope,
					context
				)
			}
			case GrantTypes.MultifactorToken.id: {
				const mfaCredentials = getMultifactorCredentialsFromRequest(req)
				if (!mfaCredentials) {
					throw new GrayskullError(GrayskullErrorCode.InvalidOTP, 'otp_token and challenge_token are required')
				}
				accessTokenResponse = await getTokensFromMultifactorTokenActivity(
					clientCredentials.client_id,
					clientCredentials.client_secret,
					mfaCredentials.otp_token,
					mfaCredentials.challenge_token,
					context
				)
			}
			default: {
				throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'Invalid grant_type')
			}
		}

		res.json(accessTokenResponse)
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
}
