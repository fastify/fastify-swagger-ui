'use strict'

const fp = require('fastify-plugin')

function fastifySwaggerUi (fastify, opts, next) {
  fastify.decorate('swaggerCSP', require('./static/csp.json'))

  fastify.register(require('./lib/routes'), {
    prefix: opts.routePrefix || '/documentation',
    uiConfig: opts.uiConfig || {},
    initOAuth: opts.initOAuth || {},
    hooks: opts.uiHooks,
    ...opts
  })

  next()
}

module.exports = fp(fastifySwaggerUi, {
  fastify: '4.x',
  name: '@fastify/swagger-ui',
  dependencies: ['@fastify/swagger']
})
