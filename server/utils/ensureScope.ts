import { RequestContext, getClientRequestOptionsFromRequest } from '../../operations/logic/authentication'

export async function ensureScope(scopeId: string, req: RequestContext) {
  const clientOptions = await getClientRequestOptionsFromRequest(req)
  return !!clientOptions && clientOptions.accessToken.scopes.includes(scopeId)
}
