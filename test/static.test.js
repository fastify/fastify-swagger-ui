'use strict'

const fs = require('node:fs')
const resolve = require('node:path').resolve
const { test } = require('tap')
const yaml = require('yaml')
const Fastify = require('fastify')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUi = require('../index')

const oauthRedirectHtml = fs.readFileSync(resolve(__dirname, '..', 'static', 'oauth2-redirect.html'), 'utf8')
const exampleStaticSpecificationYaml = fs.readFileSync(
  resolve(__dirname, '..', 'examples', 'example-static-specification.yaml'),
  'utf8'
)

test('swagger route returns yaml', async (t) => {
  t.plan(3)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.yaml'
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi)

  // check that yaml is there
  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/yaml'
  })

  t.equal(typeof res.payload, 'string')
  t.equal(res.headers['content-type'], 'application/x-yaml')
  yaml.parse(res.payload)
  t.pass('valid swagger yaml')
})

test('swagger route returns json', async (t) => {
  t.plan(3)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.json'
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi)

  // check that json is there
  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/json'
  })

  t.equal(typeof res.payload, 'string')
  t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
  yaml.parse(res.payload)
  t.pass('valid swagger json')
})

test('postProcessor works, swagger route returns updated yaml', async (t) => {
  t.plan(4)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.yaml',
      postProcessor: function (swaggerObject) {
        swaggerObject.servers[0].url = 'http://localhost:4000/'
        return swaggerObject
      }
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi)

  // check that yaml is there
  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/yaml'
  })

  t.equal(typeof res.payload, 'string')
  t.equal(res.headers['content-type'], 'application/x-yaml')
  yaml.parse(res.payload)
  t.matchSnapshot(res.payload)
  t.pass('valid swagger yaml')
})

test('swagger route returns explicitly passed doc', async (t) => {
  t.plan(2)

  const document = {
    info: {
      title: 'Test swagger',
      description: 'testing the fastify swagger api',
      version: '0.1.0'
    }
  }

  const config = {
    mode: 'static',
    specification: {
      document
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)

  // check that json is there
  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/json'
  })

  const payload = JSON.parse(res.payload)
  t.matchSnapshot(JSON.stringify(payload, null, 2))
  t.pass('valid explicitly passed spec document')
})

test('/documentation/:file should serve static file from the location of main specification file', async (t) => {
  t.plan(4)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.yaml'
    }
  }

  const uiConfig = {
    baseDir: resolve(__dirname, '..', 'examples')
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi, uiConfig)

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/non-existing-file'
    })

    t.equal(res.statusCode, 404)
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/example-static-specification.yaml'
    })

    t.equal(res.statusCode, 200)
    t.equal(exampleStaticSpecificationYaml, res.payload)
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/dynamic-swagger.js'
    })

    t.equal(res.statusCode, 200)
  }
})

test('/documentation/non-existing-file calls custom NotFoundHandler', async (t) => {
  t.plan(1)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.yaml'
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi)
  fastify.setNotFoundHandler((request, reply) => {
    reply.code(410).send()
  })

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/some-file-that-does-not-exist.js'
  })

  t.equal(res.statusCode, 410)
})

test('/documentation/:file should be served from custom location', async (t) => {
  t.plan(2)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.yaml',
      baseDir: resolve(__dirname, '..', 'static')
    }
  }

  const uiConfig = {
    baseDir: resolve(__dirname, '..', 'static')
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi, uiConfig)

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/oauth2-redirect.html'
  })

  t.equal(res.statusCode, 200)
  t.equal(oauthRedirectHtml, res.payload)
})

test('/documentation/:file should be served from custom location with trailing slash(es)', async (t) => {
  t.plan(2)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.yaml'
    }
  }

  const uiConfig = {
    baseDir: resolve(__dirname, '..', 'static') + '/'
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi, uiConfig)

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/oauth2-redirect.html'
  })

  t.equal(res.statusCode, 200)
  t.equal(oauthRedirectHtml, res.payload)
})

test('/documentation/yaml returns cache.swaggerString on second request in static mode', async (t) => {
  t.plan(6)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.yaml'
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi)

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/yaml'
    })

    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/x-yaml')
    yaml.parse(res.payload)
    t.pass('valid swagger yaml')
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/yaml'
    })

    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/x-yaml')
    yaml.parse(res.payload)
    t.pass('valid swagger yaml')
  }
})

test('/documentation/json returns cache.swaggerObject on second request in static mode', async (t) => {
  t.plan(6)

  const config = {
    mode: 'static',
    specification: {
      path: './examples/example-static-specification.json'
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi)

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/json'
    })

    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
    t.pass('valid swagger json')
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/json'
    })

    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
    t.pass('valid swagger json')
  }
})

test('/documentation/yaml returns cache.swaggerString on second request in dynamic mode', async (t) => {
  t.plan(6)

  const config = {
    specification: {
      path: './examples/example-static-specification.yaml'
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi)

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/yaml'
    })

    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/x-yaml')
    yaml.parse(res.payload)
    t.pass('valid swagger yaml')
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/yaml'
    })

    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/x-yaml')
    yaml.parse(res.payload)
    t.pass('valid swagger yaml')
  }
})

test('/documentation/json returns cache.swaggerObject on second request in dynamic mode', async (t) => {
  t.plan(6)

  const config = {
    specification: {
      path: './examples/example-static-specification.json'
    }
  }

  const fastify = Fastify()
  await fastify.register(fastifySwagger, config)
  await fastify.register(fastifySwaggerUi)

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/json'
    })

    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
    t.pass('valid swagger json')
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/json'
    })

    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/json; charset=utf-8')
    t.pass('valid swagger json')
  }
})
