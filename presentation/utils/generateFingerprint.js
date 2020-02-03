import UAParser from 'ua-parser-js'

export default async function generateFingerprint() {
  if (!Fingerprint2) {
    // eslint-disable-next-line no-console
    console.error('Fingerprint2 is not loaded')
    return ''
  }

  const opts = {
    exclude: { plugins: true },
    preprocessor: (key, value) => {
      if (key === 'userAgent') {
        const parser = new UAParser(value)
        const userAgentMinusVersion = `${parser.getOS().name} ${parser.getBrowser().name}`
        return userAgentMinusVersion
      }
      return value
    }
  }

  const components = await Fingerprint2.getPromise(opts)
  const values = components.map((comp) => comp.value)
  const fingerprint = Fingerprint2.x64hash128(values.join(''), 31)
  return fingerprint
}
