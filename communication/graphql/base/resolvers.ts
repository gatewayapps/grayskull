import { GraphQLUpload } from 'apollo-server-micro'
import { GraphQLScalarType, Kind } from 'graphql'
import { Permissions } from '../../../foundation/constants/permissions'

import { IRequestContext } from '../../../foundation/context/prepareContext'
import { generateBackupCodeActivity } from '../../../activities/generateBackupCodeActivity'
import { streamToString } from '../../../operations/logic/streamToString'
import { Stream } from 'stream'
import { restoreConfigurationActivity } from '../../../activities/restoreConfigurationActivity'

import { uploadFileResolver } from './uploadFileResolver'
import { sendVerificationCodeToPhoneNumberResolver } from './sendVerificationCodeToPhoneNumberResolver'
import { addPhoneNumberWithVerificationCodeResolver } from './addPhoneNumberWithVerificationCodeResolver'
import { sendOTPActivity } from '../../../activities/sendOTPActivity'
import { GrantTypes } from '../../../foundation/constants/grantTypes'

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
		grantTypes: async () => {
			return Object.values(GrantTypes).filter((gt) => !gt.hidden)
		},
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
			const backupDownloadCode = await generateBackupCodeActivity(context)
			return {
				success: true,
				downloadUrl: `/api/backup?code=${backupDownloadCode}`
			}
		}
	},
	Mutation: {
		uploadFile: uploadFileResolver,
		sendVerificationCodeToPhoneNumber: sendVerificationCodeToPhoneNumberResolver,
		addPhoneNumberWithVerificationCode: addPhoneNumberWithVerificationCodeResolver,
		sendOTP: async (obj, args, context: IRequestContext) => {
			const { emailAddress, id, type } = args
			await sendOTPActivity(emailAddress, type, id, context)
			return {
				success: true
			}
		},
		restoreConfiguration: async (obj, args, context: IRequestContext) => {
			try {
				const { createReadStream } = await args.file
				const readStream: Stream = createReadStream()

				const contents = await streamToString(readStream)
				await restoreConfigurationActivity(contents, context)
				return { success: true }
			} catch (err) {
				console.error(err)
				return {
					success: false,
					error: err.message,
					message: err.message
				}
			}
		}
	}
}
