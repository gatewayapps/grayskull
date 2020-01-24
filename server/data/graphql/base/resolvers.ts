import { GraphQLUpload } from 'apollo-server-micro'
import { GraphQLScalarType, Kind } from 'graphql'
import { Permissions } from '../../../utils/permissions'
import UploadService from '../../../api/services/UploadService'

import { IRequestContext } from '../../../../context/prepareContext'
import { randomBytes } from 'crypto'
import { cacheValue } from '../../../../services/persistentCache/cacheValue'

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
    securityConfiguration: async (obj, args, context: IRequestContext) => {
      const config = context.configuration

      return {
        multifactorRequired: config.Security.multifactorRequired,
        passwordRequiresLowercase: config.Security.passwordRequiresLowercase,
        passwordRequiresUppercase: config.Security.passwordRequiresUppercase,
        passwordRequiresNumber: config.Security.passwordRequiresNumber,
        passwordRequiresSymbol: config.Security.passwordRequiresSymbol,
        passwordMinimumLength: config.Security.passwordMinimumLength,
        allowSignup: config.Security.allowSignup
      }
    },
    serverConfiguration: async (obj, args, context: IRequestContext) => {
      const config = context.configuration
      return config.Server
    },
    isOobe: async (obj, args, context: IRequestContext) => {
      const isServerConfigured = !!context.configuration.Server.baseUrl
      return !isServerConfigured
    }
  },
  Mutation: {
    uploadFile: async (obj, args) => {
      return UploadService.createUpload(args.file)
    },
    backupConfiguration: async (obj, args, context: IRequestContext) => {
      if (!context.user || context.user.permissions !== Permissions.Admin) {
        return { success: false }
      } else {
        const backupDownloadCode = randomBytes(32).toString('hex')
        await cacheValue('BACKUP_DOWNLOAD_CODE', backupDownloadCode, 30, context.dataContext)
        return {
          success: true,
          downloadUrl: `/api/backup?code=${backupDownloadCode}`
        }
      }
    },
    restoreConfiguration: async (obj, args, context: IRequestContext) => {
      return {}
    }
  }
}
