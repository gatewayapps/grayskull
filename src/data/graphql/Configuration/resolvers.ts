import ConfigurationService from '../../../api/services/ConfigurationService'

export default {
  Query: {
    configuration: (obj, args, context, info) => {
      // Insert your configuration implementation here
      throw new Error('configuration is not implemented')
    }
  },
  Mutation: {
    verifyDatabaseConnection: async (obj, args, context, info) => {
      // Insert your verifyDatabaseConnection implementation here
      try {
        const success = await ConfigurationService.verifyDatabaseConnection(args.data)
        return {
          success
        }
      } catch (err) {
        return {
          success: false,
          error: err.message
        }
      }
    }
  },
  Configuration: {}
}
