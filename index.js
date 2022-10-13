'use strict'

const fp = require('fastify-plugin')

function fastifySwaggerUi (fastify, opts, next) {
  fastify.decorate('swaggerCSP', require('./static/csp.json'))

  fastify.register(require('./lib/routes'), {
    baseDir: opts.baseDir,
    prefix: opts.routePrefix || '/documentation',
    uiConfig: opts.uiConfig || {},
    initOAuth: opts.initOAuth || {},
    staticCSP: opts.staticCSP,
    transformStaticCSP: opts.transformStaticCSP,
    hooks: opts.uiHooks,
    logLevel: opts.logLevel
  })

  next()
}

module.exports = fp(fastifySwaggerUi, {
  fastify: '4.x',
  name: '@fastify/swagger-ui',
  dependencies: ['@fastify/swagger']
})
