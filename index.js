'use strict'

const fsPromises = require('node:fs/promises')
const path = require('node:path')
const fp = require('fastify-plugin')
const csp = require('./static/csp.json')

async function fastifySwaggerUi (fastify, opts) {
  const logoContent = await fsPromises.readFile(path.join(__dirname, './static/logo.svg'))

  fastify.decorate('swaggerCSP', csp)

  await fastify.register(require('./lib/routes'), {
    prefix: opts.routePrefix || '/documentation',
    uiConfig: opts.uiConfig || {},
    initOAuth: opts.initOAuth || {},
    hooks: opts.uiHooks,
    theme: opts.theme || {},
    logo: opts.logo || { type: 'image/svg+xml', content: logoContent },
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
