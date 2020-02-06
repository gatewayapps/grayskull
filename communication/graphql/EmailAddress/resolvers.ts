import EmailAddressService from '../../../server/api/services/EmailAddressService'

import EmailAddressRepository from '../../../server/data/repositories/EmailAddressRepository'
import { Permissions } from '../../../foundation/constants/permissions'
import { IRequestContext } from '../../../foundation/context/prepareContext'
import { setPrimaryEmailAddressForUser } from '../../../activities/setPrimaryEmailAddressForUser'

export default {
  Query: {
    emailAddresses: (obj, args, context) => {
      return EmailAddressService.getEmailAddresses(args.where, { userContext: context.user })
    },
    emailAddressesMeta: (obj, args, context) => {
      return EmailAddressService.emailAddressesMeta(args.where, { userContext: context.user })
    },
    emailAddress: async (obj, args, context) => {
      return EmailAddressService.getEmailAddress(args.where, { userContext: context.user })
    },
    emailAddressAvailable: async (obj, args, context) => {
      const result = await EmailAddressService.isEmailAddressAvailable(args.emailAddress, {
        userContext: context.user
      })
      return result
    },
    myEmailAddresses: async (obj, args, context) => {
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      } else {
        return await EmailAddressRepository.getEmailAddresses(
          { userAccountId_equals: context.user.userAccountId },
          { userContext: context.user }
        )
      }
    }
  },
  Mutation: {
    addEmailAddress: async (obj, args, context: IRequestContext) => {
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      }
      const isAvailable = await EmailAddressService.isEmailAddressAvailable(args.data.emailAddress, {
        userContext: context.user
      })
      if (!isAvailable) {
        return {
          success: false,
          message: 'That email address is already in use'
        }
      }

      try {
        await EmailAddressService.createEmailAddress(
          { emailAddress: args.data.emailAddress, userAccountId: context.user.userAccountId, verificationSecret: '' },
          context.configuration,
          { userContext: context.user }
        )
        return {
          success: true
        }
      } catch (err) {
        return {
          success: false,
          message: err.message
        }
      }
    },
    sendVerification: async (obj, args, context: IRequestContext) => {
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      }

      const emailAddress = await EmailAddressRepository.getEmailAddress(
        { emailAddress: args.data.emailAddress },
        { userContext: context.user }
      )
      if (emailAddress && !emailAddress.verified) {
        await EmailAddressService.sendVerificationEmail(emailAddress.emailAddress, context.configuration, {
          userContext: context.user
        })
        return {
          success: true
        }
      } else {
        return {
          success: false,
          message: 'Something went wrong'
        }
      }
    },
    setEmailAddressPrimary: async (obj, args, context: IRequestContext) => {
      try {
        await setPrimaryEmailAddressForUser(args.data.emailAddressId, context)
        return { success: true }
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  },
  EmailAddress: {}
}
