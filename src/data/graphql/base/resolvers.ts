import ConfigurationManager from '@/config/ConfigurationManager'
import { GraphQLScalarType, Kind } from 'graphql'

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null
    }
  }),
  Query: {
    configuration: (obj, args, context, info) => {
      return {
        multifactorRequired: ConfigurationManager.Security.multifactorRequired,
        passwordRequireLowercase: ConfigurationManager.Security.passwordRequireLowercase,
        passwordRequireUppercase: ConfigurationManager.Security.passwordRequireUppercase,
        passwordRequireNumber: ConfigurationManager.Security.passwordRequireNumber,
        passwordRequireSymbol: ConfigurationManager.Security.passwordRequireSymbol,
        passwordMinimumLength: ConfigurationManager.Security.passwordMinimumLength,
        realmName: ConfigurationManager.General.realmName,
      }
    }
  }
}
