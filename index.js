'use strict'

const fp = require('fastify-plugin')
const { readFile } = require('node:fs/promises')
const path = require('node:path')

async function fastifySwaggerUi (fastify, opts) {
  fastify.decorate('swaggerCSP', require('./static/csp.json'))

  fastify.register(require('./lib/routes'), {
    prefix: opts.routePrefix || '/documentation',
    uiConfig: opts.uiConfig || {},
    initOAuth: opts.initOAuth || {},
    hooks: opts.uiHooks,
    theme: opts.theme || {},
    logo: opts.logo || { type: 'image/svg+xml', content: await readFile(path.join(__dirname, './static/logo.svg')) },
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
