'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUi = require('../index')

test('Swagger source does not contain sourceMaps', async (t) => {
  t.plan(2)
  const fastify = Fastify()
  await fastify.register(fastifySwagger)
  await fastify.register(fastifySwaggerUi)

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/static/swagger-ui.js'
  })

  const includesSourceMap = res.payload.includes('sourceMappingURL')
  t.equal(includesSourceMap, false)
  t.equal(res.headers['content-type'], 'application/javascript; charset=UTF-8')
})

test('Swagger css does not contain sourceMaps', async (t) => {
  t.plan(2)
  const fastify = Fastify()
  await fastify.register(fastifySwagger)
  await fastify.register(fastifySwaggerUi)

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/static/swagger-ui.css'
  })

  const includesSourceMap = res.payload.includes('sourceMappingURL')
  t.equal(includesSourceMap, false)
  t.equal(res.headers['content-type'], 'text/css; charset=UTF-8')
})
