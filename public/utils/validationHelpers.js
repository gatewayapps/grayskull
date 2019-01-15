import validator from 'validator'

export function isUrl(url) {
  return validator.isURL(url, { require_tld: false, require_valid_protocol: false })
}

export function isUrlOrEmpty(url) {
  return !url || validator.isURL(url, { require_tld: false, require_valid_protocol: false })
}

export function allValidUrls(uris) {
  if (!Array.isArray(uris) || uris.length === 0) {
    return false
  }

  return uris.some((uri) => !validator.isURL(uri, { require_valid_protocol: false }))
}
