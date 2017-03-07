'use strict'
// for best results, require fastDate **BEFORE** http\
var fastDate = require('../')
var http = require('http')

http.createServer(function (req, res) {
  res.end(fastDate())
}).listen(8080)