'use strict'

const fs = require('node:fs')
const fse = require('fs-extra')
const crypto = require('node:crypto')
const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath()
const resolve = require('node:path').resolve

const folderName = 'static'

fse.emptyDirSync(resolve(`./${folderName}`))

// since the original swagger-ui-dist folder contains non UI files
const filesToCopy = [
  'index.html',
  'index.css',
  'oauth2-redirect.html',
  'swagger-ui-bundle.js',
  'swagger-ui-bundle.js.map',
  'swagger-ui-standalone-preset.js',
  'swagger-ui-standalone-preset.js.map',
  'swagger-ui.css',
  'swagger-ui.css.map',
  'swagger-ui.js',
  'swagger-ui.js.map'
]
filesToCopy.forEach(filename => {
  fse.copySync(`${swaggerUiAssetPath}/${filename}`, resolve(`./static/${filename}`))
})

const overrides = [
  'favicon-16x16.png',
  'favicon-32x32.png',
  'logo.svg'
]
overrides.forEach(filename => {
  fse.copySync(`./${filename}`, resolve(`./static/${filename}`))
})

const sha = {
  script: [],
  style: []
}
function computeCSPHashes (path) {
  const scriptRegex = /<script>(.*)<\/script>/gis
  const styleRegex = /<style>(.*)<\/style>/gis
  const indexSrc = fs.readFileSync(resolve(path)).toString('utf8')
  let result = scriptRegex.exec(indexSrc)
  while (result !== null) {
    const hash = crypto.createHash('sha256')
    hash.update(result[1])
    sha.script.push(`'sha256-${hash.digest().toString('base64')}'`)
    result = scriptRegex.exec(indexSrc)
  }
  result = styleRegex.exec(indexSrc)
  while (result !== null) {
    const hash = crypto.createHash('sha256')
    hash.update(result[1])
    sha.style.push(`'sha256-${hash.digest().toString('base64')}'`)
    result = styleRegex.exec(indexSrc)
  }
}
computeCSPHashes(`./${folderName}/index.html`)
computeCSPHashes(`./${folderName}/oauth2-redirect.html`)
fse.writeFileSync(resolve(`./${folderName}/csp.json`), JSON.stringify(sha))
