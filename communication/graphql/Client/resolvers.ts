import ClientService from '../../../server/api/services/ClientService'

export default {
  Query: {
    clients: (obj, args, context) => {
      if (context.user) {
        return ClientService.getClients(args.where, { userContext: context.user })
      } else {
        return ClientService.getPublicClients(args.where, { userContext: context.user })
      }
    },
    clientsMeta: (obj, args, context) => {
      // Insert your clientsMeta implementation here
      return ClientService.clientsMeta(args.where, { userContext: context.user })
    },
    client: async (obj, args, context) => {
      // Insert your client implementation here
      return ClientService.getClient(args.where, { userContext: context.user })
    }
  },
  Mutation: {
    createClient: (obj, args, context) => {
      if (!context.user) {
        throw new Error('You must be logged in to create a client')
      }
      return ClientService.createClient(args.data, { userContext: context.user })
    },
    updateClient: (obj, args, context) => {
      if (!context.user) {
        throw new Error('You must be logged in to update a client')
      }
      const { client_id, ...data } = args.data
      return ClientService.updateClient({ client_id }, data, { userContext: context.user })
    }
  },
  Client: {}
}
