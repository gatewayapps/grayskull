export default {
  Query: {
    configuration: (obj, args, context, info) => {
      // Insert your configuration implementation here
      throw new Error('configuration is not implemented')
    }
  },
  Mutation: {
    saveConfiguration: async (obj, args, context, info) => {
      // Insert your saveConfiguration implementation here
      try {
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
    verifyCertbot: async (obj, args, context, info) => {
      try {
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
