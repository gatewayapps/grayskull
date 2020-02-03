import { addDays } from 'date-fns'
import { shouldUserChangePassword } from './shouldUserChangePassword'

describe('shouldUserChangePassword', () => {
  it('Should return false if maxPasswordAge is 0', () => {
    const shouldChangePassword = shouldUserChangePassword(new Date(), 0)
    expect(shouldChangePassword).toEqual(false)
  })
  it('Should return false if maxPasswordAge is 10 and lastPasswordChange is now', () => {
    const shouldChangePassword = shouldUserChangePassword(new Date(), 10)
    expect(shouldChangePassword).toEqual(false)
  })

  it('Should return false if maxPasswordAge is 10 and lastPasswordChange is 20 days ago', () => {
    const minDate = addDays(new Date(), -10)

    const shouldChangePassword = shouldUserChangePassword(minDate, 10)
    expect(shouldChangePassword).toEqual(true)
  })
})
