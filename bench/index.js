'use strict'

var fastbench = require('fastbench')
var fastDateUtc = require('../')({format: 'utc'})
var fastDateUnix = require('../')({format: 'unix'})

var run = fastbench([
  function NativeDate (cb) {
    (new Date()).toUTCString()
    setImmediate(cb)
  },
  function FastDateUnix (cb) {
    fastDateUnix()
    setImmediate(cb)
  },
  function FastDateUtc (cb) {
    fastDateUtc()
    setImmediate(cb)
  },
  function DateNow (cb) {
    Date.now()
    setImmediate(cb)
  }
], 100000)

run(run)
