import { listClientsActivity } from '../../../activities/listClientsActivity'
import { getClientsMetaActivity } from '../../../activities/getClientsMetaActivity'
import { IRequestContext } from '../../../foundation/context/prepareContext'
import { getClientByIdActivity } from '../../../activities/getClientByIdActivity'
import { createClientActivity } from '../../../activities/createClientActivity'
import { updateClientByIdActivity } from '../../../activities/updateClientByIdActivity'

export default {
	Query: {
		clients: (obj, args, context: IRequestContext) => {
			return listClientsActivity(args.filter, args.offset || 0, args.limit || 100, context)
		},
		clientsMeta: (obj, args, context: IRequestContext) => {
			return getClientsMetaActivity(args.filter, context)
		},
		client: async (obj, args, context: IRequestContext) => {
			const clientId = args.where.client_id
			return getClientByIdActivity(clientId, context)
		}
	},
	Mutation: {
		createClient: (obj, args, context: IRequestContext) => {
			return createClientActivity(args.data, context)
		},
		updateClient: async (obj, args, context: IRequestContext) => {
			const { client_id, ...data } = args.data
			await updateClientByIdActivity(client_id, data, context)
			return getClientByIdActivity(client_id, context)
		}
	},
	Client: {}
}
