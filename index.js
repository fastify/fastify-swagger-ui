'use strict'

const fp = require('fastify-plugin')
const { readFile } = require('fs/promises')

async function fastifySwaggerUi (fastify, opts) {
  fastify.decorate('swaggerCSP', require('./static/csp.json'))

  fastify.register(require('./lib/routes'), {
    prefix: opts.routePrefix || '/documentation',
    uiConfig: opts.uiConfig || {},
    initOAuth: opts.initOAuth || {},
    hooks: opts.uiHooks,
    theme: opts.theme || {},
    logo: opts.logo || { type: 'image/svg+xml', content: await readFile(require.resolve('./static/logo.svg')) },
    ...opts
  })
}

module.exports = fp(fastifySwaggerUi, {
  fastify: '4.x',
  name: '@fastify/swagger-ui',
  dependencies: ['@fastify/swagger']
})
module.exports.default = fastifySwaggerUi
module.exports.fastifySwaggerUi = fastifySwaggerUi
