import ClientService from '@services/ClientService'

export default {
  Query: {
    clients: (obj, args, context, info) => {
      // Insert your clients implementation here
      throw new Error('clients is not implemented')
    },
    clientsMeta: (obj, args, context, info) => {
      // Insert your clientsMeta implementation here
      throw new Error('clientsMeta is not implemented')
    },
    client: (obj, args, context, info) => {
      // Insert your client implementation here
      return ClientService.getClient(args.where)
    }
  },
  Mutation: {
    createClient: (obj, args, context, info) => {
      // Insert your createClient implementation here
      throw new Error('createClient is not implemented')
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
