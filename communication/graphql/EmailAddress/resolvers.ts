import EmailAddressService from '../../../server/api/services/EmailAddressService'

import EmailAddressRepository from '../../../server/data/repositories/EmailAddressRepository'
import { Permissions } from '../../../foundation/constants/permissions'
import { IRequestContext } from '../../../foundation/context/prepareContext'

class EmailAddressResolver {
  public getEmailAddresses(obj, args, context, info) {
    return EmailAddressService.getEmailAddresses(args.where, { userContext: context.user || null })
  }
}

export default {
  Query: {
    emailAddresses: (obj, args, context, info) => {
      return EmailAddressService.getEmailAddresses(args.where, { userContext: context.user || null })
    },
    emailAddressesMeta: (obj, args, context, info) => {
      return EmailAddressService.emailAddressesMeta(args.where, { userContext: context.user || null })
    },
    emailAddress: async (obj, args, context, info) => {
      return EmailAddressService.getEmailAddress(args.where, { userContext: context.user || null })
    },
    emailAddressAvailable: async (obj, args, context, info) => {
      const result = await EmailAddressService.isEmailAddressAvailable(args.emailAddress, {
        userContext: context.user || null
      })
      return result
    },
    myEmailAddresses: async (obj, args, context, info) => {
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
    addEmailAddress: async (obj, args, context: IRequestContext, info) => {
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
    sendVerification: async (obj, args, context: IRequestContext, info) => {
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
    setEmailAddressPrimary: async (obj, args, context, info) => {
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      }

      const emailAddress = await EmailAddressRepository.getEmailAddress(
        { emailAddressId: args.data.emailAddressId },
        { userContext: context.user }
      )
      if (!emailAddress) {
        throw new Error('Unable to find an email address with that id')
      } else {
        if (
          emailAddress.userAccountId !== context.user.userAccountId &&
          context.user.permissions !== Permissions.Admin
        ) {
          throw new Error('You do not have access to that')
        }
        if (!emailAddress.verified) {
          return {
            success: false,
            message: 'Only verified email addresses can be set as primary'
          }
        } else {
          const currentPrimaryEmailAddress = await EmailAddressRepository.getEmailAddresses(
            { userAccountId_equals: emailAddress.userAccountId, primary_equals: true },
            { userContext: context.user }
          )
          if (currentPrimaryEmailAddress.length === 1) {
            await EmailAddressRepository.updateEmailAddress(
              { emailAddressId: currentPrimaryEmailAddress[0].emailAddressId },
              { primary: false },
              { userContext: context.user }
            )
          }
          await EmailAddressRepository.updateEmailAddress(
            { emailAddressId: emailAddress.emailAddressId },
            { primary: true },
            { userContext: context.user }
          )
          return {
            success: true
          }
        }
      }
    }
  },
  EmailAddress: {}
}
