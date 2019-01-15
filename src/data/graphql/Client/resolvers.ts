import ClientService from '@services/ClientService'

export default {
  Query: {
    clients: (obj, args, context, info) => {
      if (context.user) {
        return ClientService.getClients(args.where)
      } else {
        return ClientService.getPublicClients(args.where)
      }
    },
    clientsMeta: (obj, args, context, info) => {
      // Insert your clientsMeta implementation here
      return ClientService.clientsMeta(args.where)
    },
    client: async (obj, args, context, info) => {
      // Insert your client implementation here
      return ClientService.getClient(args.where)
    }
  },
  Mutation: {
    createClient: (obj, args, context, info) => {
      if (!context.user) {
        throw new Error('You must be logged in to create a client')
      }
      return ClientService.createClient(args.data, context.user)
    },
    updateClient: (obj, args, context, info) => {
      if (!context.user) {
        throw new Error('You must be logged in to update a client')
      }
      console.log(args)
      const { client_id, ...data } = args.data
      return ClientService.updateClient({ client_id }, data, context.user)
    }
  },
  Client: {
    createdByUser: (obj, args, context, info) => {
      // Insert your createdByUser implementation here
      throw new Error('createdByUser is not implemented')
    },
    deletedByUser: (obj, args, context, info) => {
      // Insert your deletedByUser implementation here
      throw new Error('deletedByUser is not implemented')
    },
    updatedByUser: (obj, args, context, info) => {
      // Insert your modifiedByUser implementation here
      throw new Error('updatedByUser is not implemented')
    }
  }
}
