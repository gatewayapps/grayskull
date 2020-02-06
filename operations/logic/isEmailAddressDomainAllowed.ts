import { ISecurityConfiguration } from '../../foundation/types/types'
import { compact } from 'lodash'

export function isEmailAddressDomainAllowed(emailAddress: string, securityConfiguration: ISecurityConfiguration) {
  const domain = emailAddress.split('@')[1].toLowerCase()

  if (securityConfiguration.domainWhitelist) {
    const allowedDomains = compact(securityConfiguration.domainWhitelist.toLowerCase().split(';'))
    return allowedDomains.length === 0 || allowedDomains.includes(domain)
  } else {
    return true
  }
}
