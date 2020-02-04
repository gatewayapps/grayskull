import { GraphQLUpload } from 'apollo-server-micro'
import { GraphQLScalarType, Kind } from 'graphql'
import { Permissions } from '../../../foundation/constants/permissions'
import UploadService from '../../../server/api/services/UploadService'

import { IRequestContext } from '../../../foundation/context/prepareContext'
import { randomBytes } from 'crypto'
import { cacheValue } from '../../../operations/data/persistentCache/cacheValue'
import { generateBackupCode } from '../../../activities/generateBackupCode'
import { streamToString } from '../../../operations/logic/streamToString'
import { Stream } from 'stream'
import { restoreConfiguration } from '../../../activities/restoreConfiguration'

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
    },
    backupConfiguration: async (obj, args, context: IRequestContext) => {
      const backupDownloadCode = await generateBackupCode(context)
      return {
        success: true,
        downloadUrl: `/api/backup?code=${backupDownloadCode}`
      }
    }
  },
  Mutation: {
    uploadFile: async (obj, args) => {
      return UploadService.createUpload(args.file)
    },
    restoreConfiguration: async (obj, args, context: IRequestContext) => {
      return new Promise(async (resolve, reject) => {
        try {
          const { createReadStream } = await args.file
          const readStream: Stream = createReadStream()

          const contents = await streamToString(readStream)
          await restoreConfiguration(contents, context)
          resolve({ success: true })
        } catch (err) {
          console.error(err)
          resolve({
            success: false,
            error: err.message,
            message: err.message
          })
        }
      })
    }
  }
}
