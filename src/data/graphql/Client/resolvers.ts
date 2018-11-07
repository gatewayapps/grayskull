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
      return ClientService.getClientByclient_id(args.where.client_id)
    }
  },
  Mutation: {

  },
  Client: {

  }
}
