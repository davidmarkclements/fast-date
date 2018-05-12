'use strict'
// adapted from Node core:
// https://github.com/nodejs/node/blob/3e6f1032a4fdb8ca7fba02c7d2103fba68c0ee1f/lib/_http_outgoing.js#L25-L37

var dateCache
function utcDate () {
  if (!dateCache) {
    var d = new Date()
    dateCache = d.toUTCString()
    setTimeout(() => {
      utcDate()
      dateCache = undefined
    }, 1000 - d.getMilliseconds())
  }
  return dateCache
}

module.exports = utcDate
