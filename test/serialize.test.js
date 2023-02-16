'use strict'

const { test } = require('tap')
const serialize = require('../lib/serialize')

test('serialize', async (t) => {
  t.plan(8)

  t.test('boolean', t => {
    t.plan(2)

    t.equal(serialize(true), 'true')
    t.equal(serialize(false), 'false')
  })

  t.test('number', t => {
    t.plan(7)

    t.equal(serialize(0), '0')
    t.equal(serialize(1), '1')
    t.equal(serialize(1.0), '1')
    t.equal(serialize(1.01), '1.01')
    t.equal(serialize(Infinity), 'Infinity')
    t.equal(serialize(-Infinity), '-Infinity')
    t.equal(serialize(NaN), 'NaN')
  })

  t.test('string', t => {
    t.plan(3)

    t.equal(serialize('0'), '"0"')
    t.equal(serialize('abc'), '"abc"')
    t.equal(serialize('"a'), '"\\\"a"') // eslint-disable-line no-useless-escape
  })

  t.test('bigint', t => {
    t.plan(3)

    t.equal(serialize(0n), '0n')
    t.equal(serialize(1000000000n), '1000000000n')
    t.equal(serialize(-9999n), '-9999n')
  })

  t.test('function', t => {
    t.plan(7)

    t.equal(serialize(function a () {}), 'function a () {}')
    t.equal(serialize(async function a () {}), 'async function a () {}')
    t.equal(serialize(() => {}), '() => {}')
    t.equal(serialize(async () => {}), 'async () => {}')
    t.equal(serialize(() => Date.now), '() => Date.now')

    t.equal(serialize(function () {}), 'function () {}')
    t.equal(serialize(async function () {}), 'async function () {}')
  })

  t.test('undefined', t => {
    t.plan(1)

    t.equal(serialize(undefined), 'undefined')
  })

  t.test('symbol', t => {
    t.plan(2)

    t.equal(serialize(Symbol('a')), 'Symbol("a")')
    t.equal(serialize(Symbol()), 'Symbol()') // eslint-disable-line symbol-description
  })

  t.test('object', t => {
    t.plan(7)

    t.test('null', t => {
      t.plan(1)

      t.equal(serialize(null), 'null')
    })

    t.test('RegExp', t => {
      t.plan(1)

      t.equal(serialize(/0-9/gi), '/0-9/gi')
    })

    t.test('Date', t => {
      t.plan(1)

      t.equal(serialize(new Date(0)), 'new Date(0)')
    })

    t.test('Array', t => {
      t.plan(5)

      t.equal(serialize([]), '[]')
      t.equal(serialize(['a']), '["a"]')
      t.equal(serialize([1, 1n, 'a', true]), '[1,1n,"a",true]')
      t.equal(serialize([{}]), '[{}]')
      t.equal(serialize([{ a: [{}] }]), '[{"a":[{}]}]')
    })

    t.test('POJO', t => {
      t.plan(3)

      t.equal(serialize({}), '{}')
      t.equal(serialize({ key: 'value' }), '{"key":"value"}')
      t.equal(serialize({ null: null, undefined }), '{"null":null,"undefined":undefined}')
    })

    t.test('Set', t => {
      t.plan(3)

      t.equal(serialize(new Set()), 'new Set([])')
      t.equal(serialize(new Set(['a'])), 'new Set(["a"])')
      t.equal(serialize(new Set(['a', {}])), 'new Set(["a",{}])')
    })

    t.test('Map', t => {
      t.plan(3)

      t.equal(serialize(new Map()), 'new Map([])')
      t.equal(serialize(new Map([['a', 1]])), 'new Map([["a",1]])')
      const map = new Map()
      map.set('b', 1)

      t.equal(serialize(map), 'new Map([["b",1]])')
    })
  })
})
