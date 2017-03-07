'use strict'

if (~process.moduleLoadList.indexOf('NativeModule http')) {
  process.nextTick(function () {
    var name = module.exports.TOP_NAME || 'fast-date'
    var msg = 'For best performance, load ' + name + ' before requiring http(s)'
    if (process.emitWarning) process.emitWarning(msg)
    else console.warn('Warning: ' + msg)
  })
}

try {
  var natives = process.binding('natives')
  var vm = require('vm')
  var httpOutgoing = {
    exports: {},
    require: function (path) {
      if (path === 'internal/util') {
        var internalUtil = {}
        vm.runInThisContext('(function (exports) {' +
          natives['internal/util'] +
        '})')(internalUtil)
        return internalUtil
      }
      return require(path)
    }
  }

  httpOutgoing.require.wrapped = true

  vm.runInThisContext(
    '/*fd*/(function (exports, require, module) {' +
      'if (typeof utcDate !== "undefined") exports.utcDate = utcDate\n' +
      (natives._http_outgoing || natives.http) +
    '})'
  )(httpOutgoing.exports, httpOutgoing.require, httpOutgoing)

  module.exports = httpOutgoing.exports.utcDate || require('./fallback')
} catch (e) {
  module.exports = require('./fallback')
}
