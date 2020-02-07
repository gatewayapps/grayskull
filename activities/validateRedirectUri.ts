import { IRequestContext } from '../foundation/context/prepareContext'
import { getClient } from '../operations/data/client/getClient'
import { isValidClientRedirectUri } from '../operations/logic/isValidClientRedirectUri'

export async function validateRedirectUri(client_id: string, redirectUri: string, context: IRequestContext) {
  const client = await getClient(client_id, context.dataContext)
  if (client) {
    return isValidClientRedirectUri(client, redirectUri)
  } else {
    return false
  }
}
