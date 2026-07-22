'use strict'

// only a single leading '/', safe path-segment charset, no scheme/protocol-relative values
const SAFE_PREFIX = /^\/(?!\/)[A-Za-z0-9\-._~/%]*$/

function getForwardedPrefix (opts, headers) {
  if (!opts.trustProxy) return null

  const header = headers['x-forwarded-prefix']
  if (!header) return null

  const value = header.split(',').pop().trim()
  if (!SAFE_PREFIX.test(value)) return null

  return value.replace(/\/$/, '')
}

module.exports = getForwardedPrefix
