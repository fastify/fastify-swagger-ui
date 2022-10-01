'use strict'

const fp = require('fastify-plugin')

function fastifySwaggerUi (fastify, opts, next) {
  fastify.decorate('swaggerCSP', require('./dist/csp.json'))

  const prefix = opts.routePrefix || '/documentation'
  const uiConfig = opts.uiConfig || {}
  const initOAuth = opts.initOAuth || {}
  const staticCSP = opts.staticCSP
  const transformStaticCSP = opts.transformStaticCSP
  const hooks = opts.uiHooks

  fastify.register(require('./lib/routes'), {
    prefix,
    uiConfig,
    initOAuth,
    staticCSP,
    transformStaticCSP,
    hooks
  })

  next()
}

module.exports = fp(fastifySwaggerUi, {
  fastify: '4.x',
  name: '@fastify/swagger-ui'
})
