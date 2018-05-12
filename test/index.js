
'use strict'

var fastDate = require('../')
var tap = require('tap')
var test = tap.test

// normalize across versions:
var natives = process.binding('natives')
if (!natives._http_outgoing) {
  natives._http_outgoing = natives.http
}

natives._http_outgoing = 'require.wrapped && require("internal/util");' + natives._http_outgoing

test('returns current date string', function (t) {
  t.is(fastDate(), (new Date()).toUTCString(), 'output is same as Date toUTCString')
  t.end()
})
