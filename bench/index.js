'use strict'

var fastbench = require('fastbench')
var Timer = process.binding('timer_wrap').Timer
var fastDate = require('../')

var run = fastbench([
  function NativeDate (cb) {
    (new Date()).toUTCString()
    setImmediate(cb)
  },
  function FastDate (cb) {
    fastDate()
    setImmediate(cb)
  },
  function DateNow (cb) {
    Date.now()
    setImmediate(cb)
  },
  function TimerNow (cb) {
    Timer.now()
    setImmediate(cb)
  }
], 100000)

run()
