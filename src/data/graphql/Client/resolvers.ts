import ClientService from '@services/ClientService'

export default {
  Query: {
    clients: (obj, args, context, info) => {
      console.log(context.user)
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
      // Insert your createClient implementation here
      return ClientService.createClient(args.data, context.user)
    },
    updateClient: (obj, args, context, info) => {
      // Insert your updateClient implementation here
      throw new Error('updateClient is not implemented')
    }
  },
  Client: {
    createdByUser: (obj, args, context, info) => {
      // Insert your createdByUser implementation here
      throw new Error('createdByUser is not implemented')
    },
    modifiedByUser: (obj, args, context, info) => {
      // Insert your modifiedByUser implementation here
      throw new Error('modifiedByUser is not implemented')
    }
  }
}
