'use strict'

const serialize = require('./serialize')

function swaggerInitializer (opts) {
  const logoBase64 = Buffer.from(opts.logo.content).toString('base64')
  const logoData = `data:${opts.logo.type};base64,${logoBase64}`

  return `window.onload = function () {
    function waitForElement(selector) {
      return new Promise(resolve => {
          if (document.querySelector(selector)) {
              return resolve(document.querySelector(selector));
          }
  
          const observer = new MutationObserver(mutations => {
              if (document.querySelector(selector)) {
                  observer.disconnect();
                  resolve(document.querySelector(selector));
              }
          });
  
          // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
          observer.observe(document.body, {
              childList: true,
              subtree: true
          });
      });
    }
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
      layout: "StandaloneLayout",
      validatorUrl: ${serialize(opts.validatorUrl || null)},
    }, config, {
      url: resolveUrl('./json').replace('static/json', 'json'),
      oauth2RedirectUrl: resolveUrl('./oauth2-redirect.html')
    });

    const ui = SwaggerUIBundle(resConfig)
    const logoData = '${logoData}'

    if (logoData && resConfig.layout === 'StandaloneLayout') {
      waitForElement('#swagger-ui > section > div.topbar > div > div > a').then((link) => {
        const img = document.createElement('img')
        img.height = 40
        img.src = logoData
        link.innerHTML = ''
        link.appendChild(img)
      })
    }

    ui.initOAuth(${serialize(opts.initOAuth)})
  }`
}

module.exports = swaggerInitializer
