'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUi = require('../index')

test('fastify.swaggerCSP should exist', async (t) => {
  t.plan(1)
  const fastify = Fastify()

  await fastify.register(fastifySwagger)
  await fastify.register(fastifySwaggerUi)

  await fastify.ready()
  t.ok(fastify.swaggerCSP)
})
