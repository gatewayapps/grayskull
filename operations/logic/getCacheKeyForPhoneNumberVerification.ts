export function getCacheKeyForPhoneNumberVerification(phoneNumber: string) {
  return `VERIFICATION:${phoneNumber}`
}
