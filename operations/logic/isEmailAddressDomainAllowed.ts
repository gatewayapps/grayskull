import { ISecurityConfiguration } from '../../foundation/types/types'

export function isEmailAddressDomainAllowed(emailAddress: string, securityConfiguration: ISecurityConfiguration) {
  const domain = emailAddress.split('@')[1].toLowerCase()

  if (securityConfiguration.domainWhitelist) {
    const allowedDomains = _.compact(securityConfiguration.domainWhitelist.toLowerCase().split(';'))
    return allowedDomains.length === 0 || allowedDomains.includes(domain)
  } else {
    return true
  }
}
