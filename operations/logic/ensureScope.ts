import { getClientRequestOptionsFromRequest } from './authentication'
import { IRequestContext } from '../../foundation/context/prepareContext'

export async function ensureScope(scopeId: string, context: IRequestContext) {
	const clientOptions = await getClientRequestOptionsFromRequest(context)
	return !!clientOptions && clientOptions.accessToken.scopes.includes(scopeId)
}
