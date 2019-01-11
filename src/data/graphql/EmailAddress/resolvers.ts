import EmailAddressService from '@services/EmailAddressService'

export default {
  Query: {
    emailAddresses: (obj, args, context, info) => {
      return EmailAddressService.getEmailAddresses(args.where)
    },
    emailAddressesMeta: (obj, args, context, info) => {
      return EmailAddressService.emailAddressesMeta(args.where)
    },
    emailAddress: async (obj, args, context, info) => {
      return EmailAddressService.getEmailAddress(args.where)
    }
  },
  EmailAddress: {}
}
