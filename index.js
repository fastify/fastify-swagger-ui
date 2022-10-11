'use strict'

const fp = require('fastify-plugin')

function fastifySwaggerUi (fastify, opts, next) {
  fastify.decorate('swaggerCSP', require('./static/csp.json'))

  const baseDir = opts.baseDir
  const prefix = opts.routePrefix || '/documentation'
  const uiConfig = opts.uiConfig || {}
  const initOAuth = opts.initOAuth || {}
  const staticCSP = opts.staticCSP
  const transformStaticCSP = opts.transformStaticCSP
  const hooks = opts.uiHooks

  fastify.register(require('./lib/routes'), {
    baseDir,
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
  name: '@fastify/swagger-ui',
  dependencies: ['@fastify/swagger']
})
