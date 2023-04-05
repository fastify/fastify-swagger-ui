import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { expectType } from 'tsd';
import fastifySwaggerUi, {
  FastifySwaggerUiOptions,
  FastifySwaggerInitOAuthOptions,
  FastifySwaggerUiConfigOptions,
  FastifySwaggerUiHooksOptions,
} from ".."

const app = fastify();
const uiConfig: FastifySwaggerUiConfigOptions = {
  deepLinking: true,
  defaultModelsExpandDepth: -1,
  defaultModelExpandDepth: 1,
  validatorUrl: null,
  layout: 'BaseLayout',
  supportedSubmitMethods: ['get'],
  persistAuthorization: false,
};
const initOAuth: FastifySwaggerInitOAuthOptions = {
  scopes: ['openid', 'profile', 'email', 'offline_access'],
};
const uiHooks: FastifySwaggerUiHooksOptions = {
  onRequest: (request, reply, done) => {done()},
  preHandler: (request, reply, done) => {done()},
}

app.register(fastifySwaggerUi);
app.register(fastifySwaggerUi, {});
app.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
});

const fastifySwaggerOptions: FastifySwaggerUiOptions = {
  routePrefix: '/documentation',
}
app.register(fastifySwaggerUi, fastifySwaggerOptions);

app.get('/deprecated', {
  schema: {
    deprecated: true,
    hide: true
  }
}, (req, reply) => {});

app.put('/some-route/:id', {
    schema: {
      description: 'put me some data',
      tags: ['user', 'code'],
      summary: 'qwerty',
      consumes: ['application/json', 'multipart/form-data'],
      security: [{ apiKey: []}],
      operationId: 'opeId',
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
    }
  }, (req, reply) => {});

app.put('/image.png', {
  schema: {
    description: 'returns an image',
    summary: 'qwerty',
    consumes: ['application/json', 'multipart/form-data'],
    produces: ['image/png'],
    response: {
      200: {
        type: 'string',
        format: 'binary'
      }
    }
  }
}, async (req, reply) => { reply
    .type('image/png')
    .send(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAgSURBVBhXY/iPCkB8BgYkEiSIBICiCCEoB0SBwf///wGHRzXLSklJLQAAAABJRU5ErkJggg==', 'base64'));
});

app.get('/public/route', {
    schema: {
      description: 'returns 200 OK',
      summary: 'qwerty',
      security: [],
      response: { 200: {} }
    },
    links: {
      200: {'some-route': { operationId: 'opeId'}}
    }
  }, (req, reply) => {});

app
  .register(fastifySwaggerUi, {
    routePrefix: '/documentation',
  })

app
  .register(fastifySwaggerUi, {
    initOAuth
  })
  .ready((err) => {
    app.swagger();
  });

app.register(fastifySwaggerUi, {
  uiConfig
})

app.register(fastifySwaggerUi, {
  staticCSP: true,
})

app.register(fastifySwaggerUi, {
  staticCSP: "default-src: 'self'",
})

app.register(fastifySwaggerUi, {
  staticCSP: {
    'default-src': "'self'",
    'script-src': ["'self'"]
  },
})
app.register(fastifySwaggerUi, {
  staticCSP: true,
  transformStaticCSP(header) {
    return header
  }
})

app.register(fastifySwaggerUi, {
  uiHooks,
})

app.register(fastifySwaggerUi, {
  transformSpecificationClone: true,
  transformSpecification: (swaggerObj, request, reply) => {
    expectType<FastifyRequest>(request)
    expectType<FastifyReply>(reply)
    expectType<Readonly<Record<string, any>>>(swaggerObj)
    return swaggerObj
  }
})

app.register(fastifySwaggerUi, {
  logo: {
    type: 'image/png',
    content: 'somethingsomething'
  }
})

app.register(fastifySwaggerUi, {
  theme: {}
})

app.register(fastifySwaggerUi, {
  theme: {
    favicon: [
        {
            filename: 'favicon-16x16.png',
            rel: 'icon',
            sizes: '16x16',
            type: 'image/png',
            content: Buffer.from('somethingsomething')
        }
    ],
  },
})

app.register(fastifySwaggerUi, {
  theme: {
    title: 'My Awesome Swagger Title'
  },
})
