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
    securityConfiguration: (obj, args, context, info) => {
      return {
        multifactorRequired: ConfigurationManager.Security!.multifactorRequired,
        passwordRequiresLowercase: ConfigurationManager.Security!.passwordRequiresLowercase,
        passwordRequiresUppercase: ConfigurationManager.Security!.passwordRequiresUppercase,
        passwordRequiresNumber: ConfigurationManager.Security!.passwordRequiresNumber,
        passwordRequiresSymbol: ConfigurationManager.Security!.passwordRequiresSymbol,
        passwordMinimumLength: ConfigurationManager.Security!.passwordMinimumLength
      }
    },
    serverConfiguration: (obj, args, context, info) => {
      return ConfigurationManager.General
    }
  }
}
