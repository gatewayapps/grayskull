import ConfigurationService from '../../../api/services/ConfigurationService'
import CertificateService from '@services/CertificateService'

export default {
  Query: {
    configuration: (obj, args, context, info) => {
      // Insert your configuration implementation here
      throw new Error('configuration is not implemented')
    }
  },
  Mutation: {
    saveConfiguration: async (obj, args, context, info) => {
      // Insert your saveConfiguration implementation here
      try {
        const success = await ConfigurationService.writeConfiguration(args.data)
        return {
          success: true
        }
      } catch (err) {
        return {
          success: false,
          error: err.message
        }
      }
    },
    verifyCertbot: async (obj, args, context, info) => {
      try {
        const success = await CertificateService.validateCertBot(args.domain)
        return {
          success: true
        }
      } catch (err) {
        return {
          success: false,
          error: err.message
        }
      }
    }
  },
  Configuration: {}
}
