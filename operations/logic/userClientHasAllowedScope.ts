import { IUserClient } from '../../foundation/types/types'

export function userClientHasAllowedScope(userClient: IUserClient, scope: string) {
	if (!userClient) {
		return false
	}

	if (!userClient.allowedScopes) {
		return false
	}

	try {
		const allowedScopes: string[] = JSON.parse(userClient.allowedScopes)
		return allowedScopes.includes(scope)
	} catch (err) {
		return false
	}
}
