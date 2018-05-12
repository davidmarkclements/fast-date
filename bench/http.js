var fastDate = require('../')
var http = require('http')
var autocannon = require('autocannon')
var WAIT = 20000
var nativeDateSrv = http.createServer(function (req, res) {
  res.end((new Date()).toUTCString())
})

var fastDateSrv = http.createServer(function (req, res) {
  res.end(fastDate())
})

var dateNowSrv = http.createServer(function (req, res) {
  res.end(Date.now().toString())
})

var benches = {}
var count = 0

nativeDateSrv.listen(0, function () {
  register('nativeDate', nativeDateSrv.address().port)
})

fastDateSrv.listen(0, function () {
  register('fastDate', fastDateSrv.address().port)
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
  if (count === 3) {
    run(benches.nativeDate, function () {
      setTimeout(function () {
        run(benches.fastDate, function () {
          setTimeout(function () {
            run(benches.dateNow, function () {
              console.log('=========== Complete ===========')
              process.exit(0)
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
