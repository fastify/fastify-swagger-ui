'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUi = require('../index')

test('fastify.swaggerCSP should exist', async (t) => {
  t.plan(3)
  const fastify = Fastify()

  await fastify.register(fastifySwagger)
  await fastify.register(fastifySwaggerUi)

  t.ok(fastify.swaggerCSP)
  t.ok(Array.isArray(fastify.swaggerCSP.script))
  t.ok(Array.isArray(fastify.swaggerCSP.style))
})
