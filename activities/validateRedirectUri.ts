import { IRequestContext } from "../foundation/context/prepareContext"

export async function validateRedirectUri(client_id: string, redirectUri: string, context: IRequestContext) {
  const client = await ClientRepository.getClient({ client_id }, options)
  if (client) {
    return (
      !client.redirectUris ||
      JSON.parse(client.redirectUris)
        .map((r) => r.toLowerCase().trim())
        .includes(redirectUri.toLowerCase().trim())
    )
  } else {
    return false
  }
}
