import { IClient } from '../../foundation/types/types'

export function isValidClientRedirectUri(client: IClient, redirectUri: string) {
	if (client.redirectUris) {
		const parsedUris = JSON.parse(client.redirectUris)
		return parsedUris.map((r) => r.toLowerCase().trim()).includes(redirectUri.toLowerCase().trim())
	}
	return false
}
