import EmailAddressService from '../../../server/api/services/EmailAddressService'

import EmailAddressRepository from '../../../server/data/repositories/EmailAddressRepository'

import { IRequestContext } from '../../../foundation/context/prepareContext'
import { setPrimaryEmailAddressForUser } from '../../../activities/setPrimaryEmailAddressForUser'
import { sendEmailVerification } from '../../../activities/sendEmailVerification'

import { addEmailAddress } from '../../../activities/addEmailAddress'
import { isEmailAddressAvailableActivity } from '../../../activities/isEmailAddressAvailableActivity'

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
      const result = await isEmailAddressAvailableActivity(args.data.emailAddress, context)
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
      const isAvailable = await isEmailAddressAvailableActivity(args.data.emailAddress, context)
      if (!isAvailable) {
        return {
          success: false,
          message: 'That email address is already in use'
        }
      }

      try {
        await addEmailAddress(args.data.emailAddress, context)

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

      try {
        await sendEmailVerification(args.data.emailAddress, context)
        return {
          success: true
        }
      } catch (err) {
        return {
          success: false,
          message: err.message,
          error: err.message
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
