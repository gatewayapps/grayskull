import ConfigurationManager from '@/config/ConfigurationManager'
import { GraphQLScalarType, Kind, GraphQLEnumType } from 'graphql'
import { Permissions } from '@/utils/permissions'
//import { Permissions } from '@/utils/permissions'

export default {
  Role: {
    None: Permissions.None,
    User: Permissions.User,
    Admin: Permissions.Admin
  },
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
      return ConfigurationManager.Server
    }
  }
}
