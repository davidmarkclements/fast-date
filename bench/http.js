var fastDateUtc = require('../')({format: 'utc'})
var fastDateUnix = require('../')({format: 'unix'})
var http = require('http')
var autocannon = require('autocannon')
var WAIT = 20000
var nativeDateSrv = http.createServer(function (req, res) {
  res.end((new Date()).toUTCString())
})

var fastDateUtcSrv = http.createServer(function (req, res) {
  res.end(fastDateUtc())
})

var fastDateUnixSrv = http.createServer(function (req, res) {
  res.end(fastDateUnix().toString())
})

var dateNowSrv = http.createServer(function (req, res) {
  res.end(Date.now().toString())
})

var benches = {}
var count = 0

nativeDateSrv.listen(0, function () {
  register('nativeDate', nativeDateSrv.address().port)
})

fastDateUnixSrv.listen(0, function () {
  register('fastDateUnix', fastDateUtcSrv.address().port)
})

fastDateUtcSrv.listen(0, function () {
  register('fastDateUtc', fastDateUnixSrv.address().port)
})

dateNowSrv.listen(0, function () {
  register('dateNow', dateNowSrv.address().port)
})

function register (name, port) {
  count += 1
  benches[name] = {
    title: name,
    url: 'http://localhost:' + port,
    connections: 10, // default
    pipelining: 1, // default
    duration: 10 // default
  }
  if (count === 4) {
    run(benches.nativeDate, function () {
      setTimeout(function () {
        run(benches.fastDateUnix, function () {
          setTimeout(function () {
            run(benches.fastDateUtc, function () {
              setTimeout(function () {
                run(benches.dateNow, function () {
                  console.log('=========== Complete ===========')
                  process.exit(0)
                })
              }, WAIT)
            })
          }, WAIT)
        })
      }, WAIT)
    })
  }
}

function run (opts, cb) {
  console.log('\n===========Benching ' + opts.title + '=============')
  var instance = autocannon(opts, cb)
  autocannon.track(instance)
}
