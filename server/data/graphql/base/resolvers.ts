import ConfigurationManager from '../../../config/ConfigurationManager'
import { GraphQLUpload } from 'apollo-server-micro'
import { GraphQLEnumType, GraphQLScalarType, Kind } from 'graphql'
import { Permissions } from '../../../utils/permissions'
import UploadService from '../../../api/services/UploadService'
import SettingsService from '../../../api/services/SettingService'
import { SettingsKeys } from '../../../config/KnownSettings'

export default {
  Upload: GraphQLUpload,
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
    securityConfiguration: async (obj, args, context, info) => {
      const config = await ConfigurationManager.GetCurrentConfiguration()

      return {
        multifactorRequired: config.Security!.multifactorRequired,
        passwordRequiresLowercase: config.Security!.passwordRequiresLowercase,
        passwordRequiresUppercase: config.Security!.passwordRequiresUppercase,
        passwordRequiresNumber: config.Security!.passwordRequiresNumber,
        passwordRequiresSymbol: config.Security!.passwordRequiresSymbol,
        passwordMinimumLength: config.Security!.passwordMinimumLength,
        allowSignup: config.Security!.allowSignup
      }
    },
    serverConfiguration: async (obj, args, context, info) => {
      const config = await ConfigurationManager.GetCurrentConfiguration()
      return config.Server
    },
    isOobe: async (obj, args, context, info) => {
      const isServerConfigured = await SettingsService.getBooleanSetting(SettingsKeys.SERVER_CONFIGURED)
      return !isServerConfigured
    }
  },
  Mutation: {
    uploadFile: async (obj, args, context, info) => {
      return UploadService.createUpload(args.file)
    }
  }
}
