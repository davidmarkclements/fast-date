
'use strict'

var fastDate = require('../')
var tap = require('tap')
var test = tap.test

test('defaults to utc', function (t) {
  t.is(fastDate()(), (new Date()).toUTCString(), 'output is same as Date toUTCString')
  t.end()
})

test('supports unix time via format option', function (t) {
  t.is(fastDate({format: 'unix'})(), Math.round(Date.now() / 1000), 'outputs seconds since epoch')
  t.end()
})

test('supports utc time via format option', function (t) {
  t.is(fastDate({format: 'utc'})(), (new Date()).toUTCString(), 'outputs utc timestamp')
  t.end()
})

test('utc format returns the same time within one second', function (t) {
  delete require.cache[require.resolve('.')]
  var ts = 1459875739000
  global.Date = class extends Date {
    constructor (...args) {
      args[0] = ts
      super(...args)
    }
    static now () {
      return ts
    }
  }
  const utc = require('..')({format: 'utc'})
  t.is(utc(), 'Tue, 05 Apr 2016 17:02:19 GMT', 'outputs utc')
  t.is(utc(), 'Tue, 05 Apr 2016 17:02:19 GMT', 'outputs utc again')
  ts += 1000
  setTimeout(() => {
    t.is(utc(), 'Tue, 05 Apr 2016 17:02:20 GMT', 'outputs utc for next second')
    global.Date = Object.getPrototypeOf(global.Date)
    t.end()
  }, 1005)
})

test('unix format returns the same time within one second', function (t) {
  delete require.cache[require.resolve('.')]
  var ts = 1459875739000
  global.Date = class extends Date {
    constructor (...args) {
      args[0] = ts
      super(...args)
    }
    static now () {
      return ts
    }
  }
  const utc = require('..')({format: 'unix'})
  t.is(utc(), 1459875739, 'outputs unix seconds')
  t.is(utc(), 1459875739, 'outputs unix seconds again')
  ts += 1000
  setTimeout(() => {
    t.is(utc(), 1459875740, 'outputs unix seconds for next second')
    global.Date = Object.getPrototypeOf(global.Date)
    t.end()
  }, 1005)
})

test('adds prefix/suffix to utc', function (t) {
  t.is(fastDate({
    format: 'utc', prefix: 'before', suffix: 'after'
  })(), 'before' + (new Date()).toUTCString() + 'after', 'outputs utc timestamp with prefix and suffix')
  t.end()
})

test('adds prefix/suffix to unix', function (t) {
  t.is(fastDate({
    format: 'unix', prefix: 'before', suffix: 'after'
  })(), 'before' + Math.round(Date.now() / 1000) + 'after', 'outputs unix timestamp with prefix and suffix')
  t.end()
})
