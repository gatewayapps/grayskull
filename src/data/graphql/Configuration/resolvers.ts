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
          success: true
        }
      } catch (err) {
        return {
          success: false,
          error: err.message
        }
      }
    },
    saveConfiguration: async (obj, args, context, info) => {
      // Insert your saveConfiguration implementation here
      try {
        const success = await ConfigurationService.writeConfiguration(args.data)
        return {
          success: true
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
