'use strict'

function indexHtml (opts) {
  return (url) => `<!-- HTML for static distribution bundle build -->
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>${opts.theme?.title || 'Swagger UI'}</title>
  <link rel="stylesheet" type="text/css" href="${url}${opts.staticPrefix}/swagger-ui.css" />
  <link rel="stylesheet" type="text/css" href="${url}${opts.staticPrefix}/index.css" />
  ${opts.theme && opts.theme.css ? opts.theme.css.map(css => `<link rel="stylesheet" type="text/css" href="${url}${opts.staticPrefix}/theme/${css.filename}" />\n`).join('') : ''}
  ${opts.theme && opts.theme.favicon
? opts.theme.favicon.map(favicon => `<link rel="${favicon.rel}" type="${favicon.type}" href="${url}${opts.staticPrefix}/theme/${favicon.filename}" sizes="${favicon.sizes}" />\n`).join('')
: `
  <link rel="icon" type="image/png" href="${url}${opts.staticPrefix}/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="${url}${opts.staticPrefix}/favicon-16x16.png" sizes="16x16" />
  `}
  </head>
  
  <body>
  <div id="swagger-ui"></div>
  <script src="${url}${opts.staticPrefix}/swagger-ui-bundle.js" charset="UTF-8"> </script>
  <script src="${url}${opts.staticPrefix}/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
  <script src="${url}${opts.staticPrefix}/swagger-initializer.js" charset="UTF-8"> </script>
  ${opts.theme && opts.theme.js ? opts.theme.js.map(js => `<script src="${url}${opts.staticPrefix}/theme/${js.filename}" charset="UTF-8"> </script>\n`).join('') : ''}
  </body>
  </html>
  `
}

module.exports = indexHtml
