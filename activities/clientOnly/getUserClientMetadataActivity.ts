import { getUserClientMetadata } from '../../operations/data/userClientMeta/getUserClientMetadata'
import { IRequestContext } from '../../foundation/context/prepareContext'

export async function getUserClientMetadataActivity(userClientId: string, context: IRequestContext) {
	return getUserClientMetadata(userClientId, context.dataContext)
}
