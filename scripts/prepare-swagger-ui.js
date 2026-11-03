'use strict'

const fs = require('node:fs')
const fse = require('fs-extra')
const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath()
const resolve = require('node:path').resolve

const folderName = 'static'

fse.emptyDirSync(resolve(`./${folderName}`))

// since the original swagger-ui-dist folder contains non UI files
const filesToCopy = [
  'index.html',
  'index.css',
  'oauth2-redirect.html',
  'oauth2-redirect.js',
  'swagger-ui-bundle.js',
  'swagger-ui-standalone-preset.js',
  'swagger-ui.css',
  'swagger-ui.js'
]
filesToCopy.forEach(filename => {
  fse.ensureFileSync(resolve(`./static/${filename}`))
  const readableStream = fs.createReadStream(`${swaggerUiAssetPath}/${filename}`, 'utf8')
  const writableStream = fs.createWriteStream(resolve(`./static/${filename}`))
  // Matches sourceMappingURL comments in .js and .css files
  const sourceMapRegex = new RegExp(String.raw`\/.# sourceMappingURL=${filename}.map(\*\/)?$`)

  readableStream.on('data', (chunk) => {
    // Copy file while removing sourceMappingURL comments
    writableStream.write(chunk.replace(sourceMapRegex, ''))
  })
})

const overrides = [
  'favicon-16x16.png',
  'favicon-32x32.png',
  'logo.svg'
]
overrides.forEach(filename => {
  fse.copySync(`./${filename}`, resolve(`./static/${filename}`))
})
