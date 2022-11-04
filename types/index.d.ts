import { FastifyPluginCallback, FastifyReply, FastifyRequest, onRequestHookHandler, preHandlerHookHandler } from 'fastify';

/**
 * Swagger-UI Vendor Extensions
 * @see https://support.smartbear.com/swaggerhub/docs/apis/vendor-extensions.html#api-docs-x-tokenname
 */
declare module 'openapi-types' {
  namespace OpenAPIV3 {
    interface OAuth2SecurityScheme {
      'x-tokenName'?: string;
    }
  }
  namespace OpenAPIV2 {
    interface SecuritySchemeOauth2Base {
      'x-tokenName'?: string;
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    swaggerCSP: {
      script: string[];
      style: string[];
    }
  }
}

export const fastifySwaggerUi: FastifyPluginCallback<FastifySwaggerUiOptions>;

export interface FastifySwaggerUiOptions {
  baseDir?: string;
  /**
   * Overwrite the swagger url end-point
   * @default /documentation
   */
  routePrefix?: string;
  /**
   * Swagger UI Config
   */
  uiConfig?: FastifySwaggerUiConfigOptions
  initOAuth?: FastifySwaggerInitOAuthOptions
  /**
   * CSP Config
   */
  staticCSP?: boolean | string | Record<string, string | string[]>
  transformStaticCSP?: (header: string) => string
  /**
   * route hooks
   */
  uiHooks?: FastifySwaggerUiHooksOptions

  transformSpecification?: (swaggerObject: Readonly<Record<string, any>>, request: FastifyRequest, reply: FastifyReply) => Record<string, any>
  transformSpecificationClone?: boolean
}

export type FastifySwaggerUiConfigOptions = Partial<{
  deepLinking: boolean
  displayOperationId: boolean
  defaultModelsExpandDepth: number
  defaultModelExpandDepth: number
  defaultModelRendering: string
  displayRequestDuration: boolean
  docExpansion: string
  filter: boolean | string
  layout: string
  maxDisplayedTags: number
  showExtensions: boolean
  showCommonExtensions: boolean
  useUnsafeMarkdown: boolean
  syntaxHighlight: {
    activate?: boolean
    theme?: string
  } | false
  tryItOutEnabled: boolean
  validatorUrl: string | null
  supportedSubmitMethods: Array<'get' | 'post' | 'put' | 'delete' | 'patch' | 'options'>
  persistAuthorization: boolean
}>

export type FastifySwaggerInitOAuthOptions = Partial<{
  clientId: string,
  clientSecret: string,
  realm: string,
  appName: string,
  scopeSeparator: string,
  scopes: string | string[],
  additionalQueryStringParams: { [key: string]: any },
  useBasicAuthenticationWithAccessCodeGrant: boolean,
  usePkceWithAuthorizationCodeGrant: boolean
}>

export type FastifySwaggerUiHooksOptions = Partial<{
  onRequest?: onRequestHookHandler,
  preHandler?: preHandlerHookHandler,
}>

export default fastifySwaggerUi;
