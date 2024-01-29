/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports['test/static.test.js > TAP > postProcessor works, swagger route returns updated yaml > must match snapshot 1'] = `
openapi: 3.0.0
info:
  description: Test swagger specification
  version: 1.0.0
  title: Test swagger specification
  contact:
    email: super.developer@gmail.com
servers:
  - url: http://localhost:4000/
    description: Localhost (uses test data)
paths:
  /status:
    get:
      description: Status route, so we can check if server is alive
      tags:
        - Status
      responses:
        "200":
          description: Server is alive
          content:
            application/json:
              schema:
                type: object
                properties:
                  health:
                    type: boolean
                  date:
                    type: string
                example:
                  health: true
                  date: 2018-02-19T15:36:46.758Z

`

exports['test/static.test.js > TAP > swagger route returns explicitly passed doc > must match snapshot 1'] = `
{
  "message": "Route GET:/documentation/json not found",
  "error": "Not Found",
  "statusCode": 404
}
`
