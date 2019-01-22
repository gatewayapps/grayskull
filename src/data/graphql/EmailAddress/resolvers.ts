import EmailAddressService from '@services/EmailAddressService'
import { hasPermission } from '@decorators/permissionDecorator'

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
      return await EmailAddressService.isEmailAddressAvailable(args.emailAddress, { userContext: context.user || null })
    }
  },
  EmailAddress: {}
}
