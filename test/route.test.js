'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const Swagger = require('@apidevtools/swagger-parser')
const yaml = require('yaml')
const fastifySwagger = require('@fastify/swagger')
const fastifySwaggerUi = require('../index')
const {
  schemaQuerystring,
  schemaBody,
  schemaParams,
  schemaSecurity,
  swaggerOption
} = require('../examples/options')

const resolve = require('node:path').resolve
const readFileSync = require('node:fs').readFileSync

const schemaParamsWithoutDesc = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        }
      }
    }
  }
}

const schemaParamsWithKey = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'user id'
        },
        key: {
          type: 'string',
          description: 'just some random key'
        }
      }
    }
  }
}

test('/documentation/json route', async (t) => {
  t.plan(1)
  const fastify = Fastify()

  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

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
  t.pass('valid swagger object')
})

test('fastify.swagger should return a valid swagger yaml', async (t) => {
  t.plan(3)
  const fastify = Fastify()

  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})
  fastify.all('/parametersWithoutDesc/:id', schemaParamsWithoutDesc, () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/yaml'
  })

  t.equal(typeof res.payload, 'string')
  t.equal(res.headers['content-type'], 'application/x-yaml')
  yaml.parse(res.payload)
  t.pass('valid swagger yaml')
})

test('/documentation should display index html', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers.location, undefined)
  t.equal(typeof res.payload, 'string')
  t.equal('text/html; charset=utf-8', res.headers['content-type'])
})

test('/documentation/ should display index html ', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers.location, undefined)
  t.equal(typeof res.payload, 'string')
  t.equal('text/html; charset=utf-8', res.headers['content-type'])
})

test('/v1/documentation should display index html', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { routePrefix: '/v1/documentation' })

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/v1/documentation'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers.location, undefined)
  t.equal(typeof res.payload, 'string')
  t.equal('text/html; charset=utf-8', res.headers['content-type'])
})

test('/v1/documentation/ should display index html', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { routePrefix: '/v1/documentation' })

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/v1/documentation/'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers.location, undefined)
  t.equal(typeof res.payload, 'string')
  t.equal('text/html; charset=utf-8', res.headers['content-type'])
})

test('/v1/foobar should display index html', async (t) => {
  t.plan(4)
  const fastify = Fastify()

  fastify.register(async function (fastify, options) {
    await fastify.register(fastifySwagger, swaggerOption)
    await fastify.register(fastifySwaggerUi, { routePrefix: '/foobar', noRedirect: true })

    fastify.get('/', () => {})
    fastify.post('/', () => {})
    fastify.get('/example', schemaQuerystring, () => {})
    fastify.post('/example', schemaBody, () => {})
    fastify.get('/parameters/:id', schemaParams, () => {})
    fastify.get('/example1', schemaSecurity, () => {})
  }, { prefix: '/v1' })

  const res = await fastify.inject({
    method: 'GET',
    url: '/v1/foobar'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers.location, undefined)
  t.equal(typeof res.payload, 'string')
  t.equal('text/html; charset=utf-8', res.headers['content-type'])
})

test('/v1/foobar/ should display index html', async (t) => {
  t.plan(4)
  const fastify = Fastify()

  fastify.register(async function (fastify, options) {
    await fastify.register(fastifySwagger, swaggerOption)
    await fastify.register(fastifySwaggerUi, { routePrefix: '/foobar' })

    fastify.get('/', () => {})
    fastify.post('/', () => {})
    fastify.get('/example', schemaQuerystring, () => {})
    fastify.post('/example', schemaBody, () => {})
    fastify.get('/parameters/:id', schemaParams, () => {})
    fastify.get('/example1', schemaSecurity, () => {})
  }, { prefix: '/v1' })

  const res = await fastify.inject({
    method: 'GET',
    url: '/v1/foobar/'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers.location, undefined)
  t.equal(typeof res.payload, 'string')
  t.equal('text/html; charset=utf-8', res.headers['content-type'])
})

test('with routePrefix: \'/\' should display index html', async (t) => {
  t.plan(4)
  const fastify = Fastify()

  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { routePrefix: '/' })

  fastify.get('/foo', () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers.location, undefined)
  t.equal(typeof res.payload, 'string')
  t.equal('text/html; charset=utf-8', res.headers['content-type'])
})

test('/documentation/static/:file should send back the correct file', async (t) => {
  t.plan(21)
  const fastify = Fastify()

  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})

  await fastify.ready()

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/static/index.html'
    })
    t.equal(res.statusCode, 302)
    t.equal(res.headers.location, '/documentation/')
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/static/'
    })
    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'text/html; charset=UTF-8')
    t.equal(
      readFileSync(
        resolve(__dirname, '..', 'static', 'index.html'),
        'utf8'
      ),
      res.payload
    )
    t.ok(res.payload.indexOf('swagger-initializer.js') !== -1)
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/static/swagger-initializer.js'
    })
    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/javascript; charset=utf-8')
    t.ok(res.payload.indexOf('resolveUrl') !== -1)
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/static/oauth2-redirect.html'
    })
    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'text/html; charset=UTF-8')
    t.equal(
      readFileSync(
        resolve(__dirname, '..', 'static', 'oauth2-redirect.html'),
        'utf8'
      ),
      res.payload
    )
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/static/swagger-ui.css'
    })
    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'text/css; charset=UTF-8')
    t.equal(
      readFileSync(
        resolve(__dirname, '..', 'static', 'swagger-ui.css'),
        'utf8'
      ),
      res.payload
    )
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/static/swagger-ui-bundle.js'
    })
    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/javascript; charset=UTF-8')
    t.equal(
      readFileSync(
        resolve(__dirname, '..', 'static', 'swagger-ui-bundle.js'),
        'utf8'
      ),
      res.payload
    )
  }

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/static/swagger-ui-standalone-preset.js'
    })
    t.equal(typeof res.payload, 'string')
    t.equal(res.headers['content-type'], 'application/javascript; charset=UTF-8')
    t.equal(
      readFileSync(
        resolve(__dirname, '..', 'static', 'swagger-ui-standalone-preset.js'),
        'utf8'
      ),
      res.payload
    )
  }
})

test('/documentation/static/:file should send back file from baseDir', async (t) => {
  t.plan(2)
  const fastify = Fastify()

  const uiConfig = {
    baseDir: resolve(__dirname, '..', 'examples', 'static')
  }

  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, uiConfig)

  {
    const res = await fastify.inject({
      method: 'GET',
      url: '/documentation/static/example-logo.svg'
    })
    t.equal(res.statusCode, 200)
    t.equal(
      res.payload,
      readFileSync(
        resolve(__dirname, '..', 'examples', 'static', 'example-logo.svg'),
        'utf8'
      )
    )
  }
})

test('/documentation/static/:file 404', async (t) => {
  t.plan(2)
  const fastify = Fastify()

  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/static/stuff.css'
  })
  const payload = JSON.parse(res.payload)
  t.equal(res.statusCode, 404)
  t.match(payload, {
    error: 'Not Found',
    statusCode: 404
  })
})

test('/documentation2/json route (overwrite)', async (t) => {
  t.plan(1)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { routePrefix: '/documentation2' })

  fastify.get('/', () => {})
  fastify.post('/', () => {})
  fastify.get('/example', schemaQuerystring, () => {})
  fastify.post('/example', schemaBody, () => {})
  fastify.get('/parameters/:id', schemaParams, () => {})
  fastify.get('/example1', schemaSecurity, () => {})
  fastify.get('/parameters/:id/:key', schemaParamsWithKey, () => {})

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation2/json'
  })

  const payload = JSON.parse(res.payload)

  await Swagger.validate(payload)
  t.pass('valid swagger object')
})

test('/documentation/:myfile should return 404 in dynamic mode', async (t) => {
  t.plan(1)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/swagger-ui.js'
  })
  t.equal(res.statusCode, 404)
})

test('/documentation/:myfile should run custom NotFoundHandler in dynamic mode', async (t) => {
  t.plan(1)
  const fastify = Fastify()
  const notFoundHandler = function (req, reply) {
    reply.code(410).send()
  }
  fastify.setNotFoundHandler(notFoundHandler)
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/swagger-ui.js'
  })
  t.equal(res.statusCode, 410)
})

test('/documentation/* should not return module files when baseDir not set', async (t) => {
  t.plan(1)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/README.md'
  })
  t.equal(res.statusCode, 404)
})

test('should return silent log level of route /documentation', async (t) => {
  const fastify = Fastify()

  fastify.addHook('onRoute', function (route) {
    t.equal(route.logLevel, 'silent')
  })

  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { logLevel: 'silent' })

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers['content-type'], 'text/html; charset=utf-8')
})

test('should return empty log level of route /documentation', async (t) => {
  const fastify = Fastify()

  fastify.addHook('onRoute', function (route) {
    t.equal(route.logLevel, '')
  })

  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi)

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/'
  })
  t.equal(res.statusCode, 200)
  t.equal(res.headers['content-type'], 'text/html; charset=utf-8')
})

test('/documentation should display index html with correct asset urls', async (t) => {
  t.plan(6)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] } })

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation'
  })

  t.equal(res.payload.includes('href="./documentation/static/index.css"'), true)
  t.equal(res.payload.includes('src="./documentation/static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="./documentation/index.css"'), false)
  t.equal(res.payload.includes('src="./documentation/theme/theme-js.js"'), false)

  let cssRes = await fastify.inject({
    method: 'GET',
    url: '/documentation/static/index.css'
  })
  t.equal(cssRes.statusCode, 200)
  cssRes = await fastify.inject({
    method: 'GET',
    url: './documentation/static/index.css'
  })
  t.equal(cssRes.statusCode, 200)
})

/**
 * This emulates when the server is inside an NGINX application that routes by path
 */
test('/documentation should display index html with correct asset urls when nested', async (t) => {
  t.plan(5)
  const fastify = Fastify()
  await fastify.register(
    async () => {
      await fastify.register(fastifySwagger, swaggerOption)
      await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] } })
    },
    {
      prefix: '/swagger-app'
    }
  )

  const res = await fastify.inject({
    method: 'GET',
    url: '/swagger-app/documentation'
  })

  t.equal(res.payload.includes('href="./documentation/static/index.css"'), true)
  t.equal(res.payload.includes('src="./documentation/static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="./documentation/index.css"'), false)
  t.equal(res.payload.includes('src="./documentation/theme/theme-js.js"'), false)

  const cssRes = await fastify.inject({
    method: 'GET',
    url: '/swagger-app/documentation/static/index.css'
  })
  t.equal(cssRes.statusCode, 200)
})

test('/documentation/ should display index html with correct asset urls', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] } })

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/'
  })

  t.equal(res.payload.includes('href="./static/index.css"'), true)
  t.equal(res.payload.includes('src="./static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="./index.css"'), false)
  t.equal(res.payload.includes('src="./theme/theme-js.js"'), false)
})

test('/docs should display index html with correct asset urls when documentation prefix is set', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] }, routePrefix: '/docs' })

  const res = await fastify.inject({
    method: 'GET',
    url: '/docs'
  })

  t.equal(res.payload.includes('href="./docs/static/index.css"'), true)
  t.equal(res.payload.includes('src="./docs/static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="./docs/index.css"'), false)
  t.equal(res.payload.includes('src="./docs/theme/theme-js.js"'), false)
})

test('/docs should display index html with correct asset urls when documentation prefix is set with no leading slash', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] }, routePrefix: 'docs' })

  const res = await fastify.inject({
    method: 'GET',
    url: '/docs'
  })

  t.equal(res.payload.includes('href="docs/static/index.css"'), true)
  t.equal(res.payload.includes('src="docs/static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="docs/index.css"'), false)
  t.equal(res.payload.includes('src="docs/theme/theme-js.js"'), false)
})

test('/docs/ should display index html with correct asset urls when documentation prefix is set', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] }, routePrefix: '/docs' })

  const res = await fastify.inject({
    method: 'GET',
    url: '/docs/'
  })

  t.equal(res.payload.includes('href="./static/index.css"'), true)
  t.equal(res.payload.includes('src="./static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="./index.css"'), false)
  t.equal(res.payload.includes('src="./theme/theme-js.js"'), false)
})

test('/documentation/ should display index html with correct asset urls', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] } })

  const res = await fastify.inject({
    method: 'GET',
    url: '/documentation/'
  })

  t.equal(res.payload.includes('href="./static/index.css"'), true)
  t.equal(res.payload.includes('src="./static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="./index.css"'), false)
  t.equal(res.payload.includes('src="./theme/theme-js.js"'), false)
})

test('/docs should display index html with correct asset urls when documentation prefix is set', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] }, routePrefix: '/docs' })

  const res = await fastify.inject({
    method: 'GET',
    url: '/docs'
  })

  t.equal(res.payload.includes('href="./docs/static/index.css"'), true)
  t.equal(res.payload.includes('src="./docs/static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="./docs/index.css"'), false)
  t.equal(res.payload.includes('src="./docs/theme/theme-js.js"'), false)
})

test('/docs/ should display index html with correct asset urls when documentation prefix is set', async (t) => {
  t.plan(4)
  const fastify = Fastify()
  await fastify.register(fastifySwagger, swaggerOption)
  await fastify.register(fastifySwaggerUi, { theme: { js: [{ filename: 'theme-js.js' }] }, routePrefix: '/docs' })

  const res = await fastify.inject({
    method: 'GET',
    url: '/docs/'
  })

  t.equal(res.payload.includes('href="./static/index.css"'), true)
  t.equal(res.payload.includes('src="./static/theme/theme-js.js"'), true)
  t.equal(res.payload.includes('href="./index.css"'), false)
  t.equal(res.payload.includes('src="./theme/theme-js.js"'), false)
})
