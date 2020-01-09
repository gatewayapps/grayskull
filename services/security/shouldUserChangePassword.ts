import { IConfiguration } from '../../data/types'

import { addDays } from 'date-fns'

export function shouldUserChangePassword(lastPasswordChange: Date, maxPasswordAge: number) {
  if (maxPasswordAge === 0) {
    return false
  }

  const minDate = addDays(new Date(), -maxPasswordAge)
  return lastPasswordChange < minDate
}
