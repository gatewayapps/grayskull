export default {
  Query: {
    configurations: (obj, args, context, info) => {
      // Insert your configurations implementation here
      throw new Error('configurations is not implemented')
    },
    configurationsMeta: (obj, args, context, info) => {
      // Insert your configurationsMeta implementation here
      throw new Error('configurationsMeta is not implemented')
    },
    configuration: (obj, args, context, info) => {
      // Insert your configuration implementation here
      throw new Error('configuration is not implemented')
    }
  },
  Mutation: {
    verifyDatabaseConnection: (obj, args, context, info) => {
      // Insert your verifyDatabaseConnection implementation here
      throw new Error('verifyDatabaseConnection is not implemented')
    }
  },
  Configuration: {}
}
