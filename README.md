# @fastify/swagger-ui

[![NPM version](https://img.shields.io/npm/v/@fastify/swagger-ui.svg?style=flat)](https://www.npmjs.com/package/@fastify/swagger-ui)
![CI](https://github.com/fastify/fastify-swagger-ui/workflows/CI/badge.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

A Fastify plugin for serving [Swagger UI](https://swagger.io/tools/swagger-ui/).

Supports Fastify versions `4.x`.

<a name="install"></a>
## Install
```
npm i @fastify/swagger-ui
```

<a name="usage"></a>
## Usage
Add it with `@fastify/swagger` to your project with `register`, pass it some options, call the `swagger` API, and you are done!

```js
const fastify = require('fastify')()

await fastify.register(require('@fastify/swagger'))

await fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSwagger: (swaggerObject, request, reply) => { return swaggerObject },
  transformSwaggerClone: true
})

fastify.put('/some-route/:id', {
  schema: {
    description: 'post some data',
    tags: ['user', 'code'],
    summary: 'qwerty',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'user id'
        }
      }
    },
    body: {
      type: 'object',
      properties: {
        hello: { type: 'string' },
        obj: {
          type: 'object',
          properties: {
            some: { type: 'string' }
          }
        }
      }
    },
    response: {
      201: {
        description: 'Successful response',
        type: 'object',
        properties: {
          hello: { type: 'string' }
        }
      },
      default: {
        description: 'Default response',
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      }
    },
    security: [
      {
        "apiKey": []
      }
    ]
  }
}, (req, reply) => {})

await fastify.ready()
```
<a name="api"></a>
## API

<a name="register.options"></a>
### Register options

#### Options

 | Option             | Default          | Description                                                                                                               |
 | ------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
 | baseDir              | undefined        | Specify the directory where all spec files that are included in the main one using $ref will be located. By default, this is the directory where the main spec file is located. Provided value should be an absolute path without trailing slash.     |
 | initOAuth            | {}               | Configuration options for [Swagger UI initOAuth](https://swagger.io/docs/open-source-tools/swagger-ui/usage/oauth2/).     |
 | routePrefix          | '/documentation' | Overwrite the default Swagger UI route prefix.                                                                            |
 | staticCSP            | false            | Enable CSP header for static resources.                                                                                   |
 | transformStaticCSP   | undefined        | Synchronous function to transform CSP header for static resources if the header has been previously set.                  |
 | transformSwagger     | undefined        | Synchronous function to transform the swagger document.                                                                   |
 | transformSwaggerClone| true             | Provide a deepcloned swaggerObject to transformSwagger                                                                    |
 | uiConfig             | {}               | Configuration options for [Swagger UI](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md). Must be literal values, see [#5710](https://github.com/swagger-api/swagger-ui/issues/5710).                                                                                                            |
 | uiHooks              | {}               | Additional hooks for the documentation's routes. You can provide the `onRequest` and `preHandler` hooks with the same [route's options](https://www.fastify.io/docs/latest/Routes/#options) interface.|
 | logLevel             | info             | Allow to define route log level.                                                                                          |

The plugin will expose the documentation with the following APIs:

| URL                     | Description                                |
| ----------------------- | ------------------------------------------ |
| `'/documentation/json'` | The JSON object representing the API       |
| `'/documentation/yaml'` | The YAML object representing the API       |
| `'/documentation/'`     | The swagger UI                             |
| `'/documentation/*'`    | External files that you may use in `$ref`  |

#### transformSwagger

There can be use cases, where you want to modify the swagger definition on request. E.g. you want to modify the server
definition based on the hostname of the request object. In such a case you can utilize the transformSwagger-option.

##### Example
```js
const fastify = require('fastify')()

await fastify.register(require('@fastify/swagger'))

await fastify.register(require('@fastify/swagger-ui'), {
  transformSwagger: (swaggerObject, req, reply) => {
    swaggerObject.host = req.hostname
    return swaggerObject
  }
})
```

By default fastify.swagger() will be deepcloned and passed to the transformSwagger-function, as fastify.swagger()
returns a mutatable Object. You can disable the deepcloning by setting transformSwaggerClone to false. This is useful,
if you want to handle the deepcloning in the transformSwagger function.

##### Example with caching
```js
const fastify = require('fastify')()
const LRU = require('tiny-lru').lru
const rfdc = require('rfdc')()

await fastify.register(require('@fastify/swagger'))

const swaggerLru = new LRU(1000)
await fastify.register(require('@fastify/swagger-ui'), {
  transformSwaggerClone: false,
  transformSwagger: (swaggerObject, req, reply) => {
    if (swaggerLru.has(req.hostname)) {
      return swaggerLru.get(req.hostname)
    }
    const clonedSwaggerObject = rfdc(swaggerObject)
    clonedSwaggerObject.host = req.hostname
    swaggerLru.set(req.hostname, clonedSwaggerObject)
    return clonedSwaggerObject
  }
})
```

<a name="license"></a>
## License

Licensed under [MIT](./LICENSE).
