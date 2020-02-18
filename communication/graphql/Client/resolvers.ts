import { listClients } from '../../../activities/listClients'
import { getClientsMeta } from '../../../activities/getClientsMeta'
import { IRequestContext } from '../../../foundation/context/prepareContext'
import { getClientById } from '../../../activities/getClientById'
import { createClient } from '../../../activities/createClientActivity'
import { updateClientById } from '../../../activities/updateClientById'

export default {
  Query: {
    clients: (obj, args, context: IRequestContext) => {
      return listClients(args.filter, args.offset || 0, args.limit || 100, context)
    },
    clientsMeta: (obj, args, context: IRequestContext) => {
      return getClientsMeta(args.filter, context)
    },
    client: async (obj, args, context: IRequestContext) => {
      const clientId = args.where.client_id
      return getClientById(clientId, context)
    }
  },
  Mutation: {
    createClient: (obj, args, context: IRequestContext) => {
      return createClient(args.data, context)
    },
    updateClient: async (obj, args, context: IRequestContext) => {
      const { client_id, ...data } = args.data
      await updateClientById(client_id, data, context)
      return getClientById(client_id, context)
    }
  },
  Client: {}
}
