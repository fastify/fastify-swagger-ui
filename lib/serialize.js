'use strict'

function serialize (value) {
  switch (typeof value) {
    case 'bigint':
      return value.toString() + 'n'
    case 'boolean':
      return value ? 'true' : 'false'
    case 'function':
      return serializeFunction(value)
    case 'number':
      return '' + value
    case 'object':
      if (value === null) {
        return 'null'
      } else if (Array.isArray(value)) {
        return serializeArray(value)
      } else if (value instanceof RegExp) {
        return `/${value.source}/${value.flags}`
      } else if (value instanceof Date) {
        return `new Date(${value.getTime()})`
      } else {
        return serializeObject(value)
      }
    case 'string':
      return JSON.stringify(value)
    case 'symbol':
      return serializeSymbol(value)
    case 'undefined':
      return 'undefined'
  }
}
const symbolRE = /Symbol\((.+)\)/
function serializeSymbol (value) {
  const symbolName = value.toString().match(symbolRE)[1]
  return `Symbol("${symbolName}")`
}

function serializeFunction (value) {
  const fn = value.toString()
  const name = value.name || 'anon' + Math.floor(Math.random() * 1e16).toString(36)

  if (/^function +\(/.test(fn)) {
    return `function ${name} (${fn.slice(fn.indexOf('(') + 1)}`
  } else if (/^async +function +\(/.test(fn)) {
    return `async function ${name} (${fn.slice(fn.indexOf('(') + 1)}`
  } else {
    return fn
  }
}

function serializeArray (value) {
  let result = '['
  const il = value.length
  const last = il - 1
  for (let i = 0; i < il; ++i) {
    result += serialize(value[i])
    i !== last && (result += ',')
  }
  return result + ']'
}

function serializeObject (value) {
  let result = '{'
  const keys = Object.keys(value)
  let i = 0
  const il = keys.length
  const last = il - 1
  for (; i < il; ++i) {
    const key = keys[i]
    result += `${key}:${serialize(value[key])}`
    i !== last && (result += ',')
  }
  return result + '}'
}

module.exports = serialize
