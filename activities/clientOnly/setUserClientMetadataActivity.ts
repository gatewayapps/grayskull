import { setUserClientMetadata } from '../../operations/data/userClientMeta/setUserClientMetadata'
import { IRequestContext } from '../../foundation/context/prepareContext'

export async function setUserClientMetadataActivity(
	userClientId: string,
	key: string,
	value: string,
	context: IRequestContext
) {
	await setUserClientMetadata(userClientId, key, value, context.dataContext)
}
