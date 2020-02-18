export function getCacheKeyForEmailVerification(emailAddress: string) {
  const finalEmailAddress = decodeURIComponent(emailAddress)
    .toLowerCase()
    .trim()

  return `VERIFICATION:${finalEmailAddress}`
}
