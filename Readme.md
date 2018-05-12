# fast-date

[![Build Status](https://travis-ci.org/davidmarkclements/fast-date.svg?branch=master)](https://travis-ci.org/davidmarkclements/fast-date)
[![codecov](https://codecov.io/gh/davidmarkclements/fast-date/branch/master/graph/badge.svg)](https://codecov.io/gh/davidmarkclements/fast-date)


High Speed UTC Timestamps 

## Supports

- [x] Node 0.10
- [x] Node 0.12
- [x] Node 4
- [x] Node 6
- [x] Node 8
- [x] Node 10

## Benchmarks

```sh
npm run bench
```

```
NativeDate*100000: 171.581ms
FastDate*100000: 91.981ms
DateNow*100000: 95.545ms
TimerNow*100000: 94.366ms
```

`fast-date` is at providing UTC timestamps as `Date.now` is at providing millisecond epochs.

## Usage

```js
// for best results, require fastDate **BEFORE** http
var fastDate = require('fast-date')
var http = require('http')

http.createServer(function (req, res) {
  res.end(fastDate())
}).listen(8080)
```

## How?

Cache the UTC timestamp for one second minus synchronous processing time.

## Tests

```sh
npm test
```

## Coverage

```sh
npm run cov 
```

```
----------|----------|----------|----------|----------|----------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
All files |      100 |      100 |      100 |      100 |                |
 index.js |      100 |      100 |      100 |      100 |                |
----------|----------|----------|----------|----------|----------------|
```

## More Benchmarks

For effects on an HTTP server:

```sh
npm run bench-http
```

```
===========Benching nativeDate=============
Running 10s test @ http://localhost:62049
10 connections

Stat         Avg      Stdev   Max
Latency (ms) 0.04     0.23    15.11
Req/Sec      18998.19 1674.91 20197
Bytes/Sec    2.45 MB  220 kB  2.61 MB

209k requests in 11s, 27 MB read

===========Benching fastDate=============
Running 10s test @ http://localhost:62050
10 connections

Stat         Avg      Stdev  Max
Latency (ms) 0.03     0.18   8.27
Req/Sec      20032.73 824.09 21889
Bytes/Sec    2.58 MB  123 kB 2.82 MB

220k requests in 11s, 28.4 MB read

===========Benching dateNow=============
Running 10s test @ http://localhost:62051
10 connections

Stat         Avg      Stdev  Max
Latency (ms) 0.04     0.21   17.23
Req/Sec      19362.19 524.63 20142
Bytes/Sec    2.2 MB   75 kB  2.28 MB

213k requests in 11s, 24.1 MB read
=========== Complete ===========
```

## License

MIT

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)