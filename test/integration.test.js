'use strict'

const { test } = require('node:test')
const Fastify = require('fastify')
const fastifySwagger = require('@fastify/swagger')
const fastifyHelmet = require('@fastify/helmet')
const fastifySwaggerUi = require('../index')
const swaggerCSP = require('../static/csp.json')

test('fastify will response swagger csp', async (t) => {
  t.plan(1)

  const scriptCSP =
    swaggerCSP.script.length > 0 ? ` ${swaggerCSP.script.join(' ')}` : ''
  const styleCSP =
    swaggerCSP.style.length > 0 ? ` ${swaggerCSP.style.join(' ')}` : ''
  const csp = `default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data: validator.swagger.io;object-src 'none';script-src 'self'${scriptCSP};script-src-attr 'none';style-src 'self' https:${styleCSP};upgrade-insecure-requests`

  const fastify = Fastify()

  await fastify.register(fastifySwagger)
  await fastify.register(fastifySwaggerUi)

  const scriptSrc = ["'self'"].concat(fastify.swaggerCSP.script)
  const styleSrc = ["'self'", 'https:'].concat(fastify.swaggerCSP.style)
  await fastify.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc,
        styleSrc
      }
    }
  })

  // route for testing CSP headers
  fastify.get('/', (_req, reply) => {
    reply.send({
      foo: 'bar'
    })
  })

  const res = await fastify.inject({
    method: 'GET',
    url: '/'
  })
  t.assert.deepStrictEqual(res.headers['content-security-policy'], csp)
})
