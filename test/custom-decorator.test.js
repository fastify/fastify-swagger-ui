'use strict'

const nodeTest = require('node:test')
const test = nodeTest.test
const Fastify = require('fastify')
const Swagger = require('@apidevtools/swagger-parser')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUi = require('../index')
const {
  schemaQuerystring,
  schemaBody,
  schemaParams,
  schemaSecurity,
  swaggerOption
} = require('../examples/options')

test('/documentation/json route', async (t) => {
  t.plan(1)
  const fastify = Fastify()

  await fastify.register(fastifySwagger, {...swaggerOption, decorator: 'customSwagger'})
  await fastify.register(fastifySwaggerUi, { decorator: 'customSwagger'})

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/json'
  })

  const payload = JSON.parse(res.payload)

  await Swagger.validate(payload)
  t.assert.ok(true, 'valid swagger object')
})
