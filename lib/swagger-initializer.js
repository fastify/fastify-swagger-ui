'use strict'

const serialize = require('./serialize')

function swaggerInitializer (opts) {
  const logoBase64 = Buffer.from(opts.logo.content).toString('base64')
  const logoData = `data:${opts.logo.type};base64,${logoBase64}`

  return `window.onload = function () {
    function resolveUrl(url) {
      const anchor = document.createElement('a')
      anchor.href = url
      return anchor.href
    }
  
    const config = ${serialize(opts.uiConfig)}
    const resConfig = Object.assign({}, {
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    }, config, {
      url: resolveUrl('./json').replace('static/json', 'json'),
      oauth2RedirectUrl: resolveUrl('./oauth2-redirect.html')
    });

    const ui = SwaggerUIBundle(resConfig)
    const logoData = '${logoData}'

    if (logoData) {
      const img = document.querySelector('#swagger-ui > section > div.topbar > div > div > a > img')
      img.src = logoData
    }

    ui.initOAuth(${serialize(opts.initOAuth)})
  }`
}

module.exports = swaggerInitializer
