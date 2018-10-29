import ClientService from '../../../api/services/ClientService'

export default {
  Query: {
    clients: (obj, args, context, info) => {
      // Insert your clients implementation here
      throw new Error('clients is not implemented')
    },
    clientByClientId: (obj, args, context, info) => {
      // Insert your clientByClientId implementation here
      return ClientService.getClientByclient_id(args.clientId)
    }
  },
  Mutation: {},
  Client: {}
}
