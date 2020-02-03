import ClientService from '../../../server/api/services/ClientService'

export default {
  Query: {
    clients: (obj, args, context, info) => {
      if (context.user) {
        return ClientService.getClients(args.where, { userContext: context.user || null })
      } else {
        return ClientService.getPublicClients(args.where, { userContext: context.user || null })
      }
    },
    clientsMeta: (obj, args, context, info) => {
      // Insert your clientsMeta implementation here
      return ClientService.clientsMeta(args.where, { userContext: context.user || null })
    },
    client: async (obj, args, context, info) => {
      // Insert your client implementation here
      return ClientService.getClient(args.where, { userContext: context.user || null })
    }
  },
  Mutation: {
    createClient: (obj, args, context, info) => {
      if (!context.user) {
        throw new Error('You must be logged in to create a client')
      }
      return ClientService.createClient(args.data, { userContext: context.user || null })
    },
    updateClient: (obj, args, context, info) => {
      if (!context.user) {
        throw new Error('You must be logged in to update a client')
      }
      const { client_id, ...data } = args.data
      return ClientService.updateClient({ client_id }, data, { userContext: context.user || null })
    }
  },
  Client: {}
}
