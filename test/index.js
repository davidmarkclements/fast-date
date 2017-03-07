'use strict'

var fastDate = require('../')
var fastDateFallback = require('../fallback')
var tap = require('tap')
var test = tap.test

test('returns current date string', function (t) {
  t.is(fastDate(), (new Date()).toUTCString(), 'output is same as Date toUTCString')
  t.end()
})

test('fallback returns current date string', function (t) {
  t.is(fastDateFallback(), (new Date()).toUTCString(), 'fallback output is same as Date toUTCString')
  t.end()
})

test('fallback uses timer based caching mechanism', function (t) {
  // wait a sec to make sure cache is cleared
  setTimeout(function () {
    var _onTimeout = fastDateFallback._onTimeout
    fastDateFallback._onTimeout = function () {
      _onTimeout() // clears cache
      t.pass('timeout complete, date cache is cleared')
      t.end()
    }
    fastDateFallback() // will gen cache
    fastDateFallback() // will use cache
  }, 1000)
})

test('falls back to fallback', function (t) {
  for (var k in require.cache) delete require.cache[k]
  Object.defineProperty(require.cache, '_http_outgoing', {
    value: {exports: {}},
    configurable: true,
    enumberable: true,
    writable: false // <-- stops cache trick working
  })
  t.is(require('../'), require('../fallback'), 'entry point is exporting fallback')
  Object.defineProperty(require.cache, '_http_outgoing', {
    writable: true
  })
  for (var p in require.cache) delete require.cache[p]
  fastDate = require('../')
  fastDateFallback = require('../fallback')
  t.end()
})

test('falls back to fallback even if attempt causes throw', function (t) {
  for (var k in require.cache) delete require.cache[k]
  require.cache._http_outgoing = {
    exports: Object.create({}, {utcDate: {
      get: function () { throw Error('whaa?') }
    }})}
  t.is(require('../'), require('../fallback'), 'entry point is exporting fallback')
  for (var p in require.cache) delete require.cache[p]
  fastDate = require('../')
  fastDateFallback = require('../fallback')
  t.end()
})

test('emits warning if http is loaded before fast-date', function (t) {
  for (var k in require.cache) delete require.cache[k]
  if (!process.emitWarning) process.emitWarning = function polyfill(msg) {
    process.emit('warning', 'Warning: ' + msg)
  }
  process.once('warning', function (msg) {
    t.is(msg.toString(), 'Warning: For best performance, load fast-date before requiring http(s)', 'warning emitted')
    if (process.emitWarning.name === 'polyfill') delete process.emitWarning
    t.end()
  })
  require('http')
  require('../')
  for (var p in require.cache) delete require.cache[p]
})

test('uses module.exports.TOP_NAME in load order warning if assigned by parent', function (t) {
  for (var k in require.cache) delete require.cache[k]
  if (!process.emitWarning) process.emitWarning = function polyfill(msg) {
    process.emit('warning', 'Warning: ' + msg)
  }
  process.once('warning', function (msg) {
    t.is(msg.toString(), 'Warning: For best performance, load some-parent-module before requiring http(s)', 'custom warning emitted')
    if (process.emitWarning.name === 'polyfill') delete process.emitWarning
    t.end()
  })
  require('http')
  require('../').TOP_NAME = 'some-parent-module'
  for (var p in require.cache) delete require.cache[p]
})

test('warning system falls back to console.warn in absence of process.emitWarning', function (t) {
  for (var k in require.cache) delete require.cache[k]
  var emitWarning = process.emitWarning
  var warn = console.warn
  delete process.emitWarning
  console.warn = function (msg) {
    t.is(msg, 'Warning: For best performance, load fast-date before requiring http(s)', 'warning emitted')
    console.warn = warn
    process.emitWarning = emitWarning
    t.end()
  }
  require('http')
  require('../')
  for (var p in require.cache) delete require.cache[p]
})

test('console.warn fallback also respects TOP_NAME', function (t) {
  for (var k in require.cache) delete require.cache[k]
  var emitWarning = process.emitWarning
  var warn = console.warn
  delete process.emitWarning
  console.warn = function (msg) {
    t.is(msg, 'Warning: For best performance, load some-parent-module before requiring http(s)', 'warning emitted')
    console.warn = warn
    process.emitWarning = emitWarning
    t.end()
  }
  require('http')
  require('../').TOP_NAME = 'some-parent-module'
  for (var p in require.cache) delete require.cache[p]
})
