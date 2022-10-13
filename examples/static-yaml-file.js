'use strict'

const fastify = require('fastify')({ logger: true })

fastify.register(require('@fastify/swagger'), {
  mode: 'static',
  specification: {
    path: './examples/example-static-specification.yaml'
  }
})

fastify.register(require('../index'))

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err
})
