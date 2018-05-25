'use strict'

module.exports = fastDate

function fastDate (opts) {
  opts = opts || {}
  var format = opts.format
  var suffix = opts.suffix || ''
  var prefix = opts.prefix || ''

  // eslint-disable-next-line
  const utcDate = Function(`
    var cache = undefined
    var clear = () => {
      cache = undefined
    }
    return function utcDate () {
      if (!cache) {
        var d = new Date()
        cache = '${prefix}' + d.toUTCString() + '${suffix}'
        setTimeout(clear, 1000 - d.getMilliseconds())
      }
      return cache
    }
  `)()

  // eslint-disable-next-line
  const unixDate = Function(`
    var cache = undefined
    var clear = () => {
      cache = undefined
    }
    return function unixDate () {
      if (!cache) {
        var d = Date.now()
        ${prefix || suffix ? `
          cache = '${prefix}' + Math.round(d / 1000.0) + '${suffix}'
        ` : `cache = Math.round(d / 1000.0)`}
        setTimeout(clear, 1000 - (d % 1000))
      }
      return cache
    }  
  `)()

  switch (format) {
    default: return utcDate
    case 'utc': return utcDate
    case 'unix': return unixDate
  }
}
