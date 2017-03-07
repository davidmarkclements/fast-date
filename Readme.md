# fast-date

[![Build Status](https://travis-ci.org/davidmarkclements/fast-date.svg?branch=master)](https://travis-ci.org/davidmarkclements/fast-date)
[![codecov](https://codecov.io/gh/davidmarkclements/fast-date/branch/master/graph/badge.svg)](https://codecov.io/gh/davidmarkclements/fast-date)


High Speed UTC Timestamps 

## Supports

- [x] Node 0.10
- [x] Node 0.12
- [x] Node 4
- [x] Node 6
- [x] Node 7

## Benchmarks

```sh
npm run bench
```

```
NativeDate*100000: 215.076ms
FastDate*100000: 124.236ms
DateNow*100000: 123.043ms
```

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

Inside of Node Core, the internal `_http_outgoing` module
(used by the `http` module) has a function called `utcDate`. 
This uses a by-the-second caching mechanism (since UTC Timestamps
minimum unit is 1s), in a performant manner. Every time an HTTP 
header is generated, this `utcDate` function is used. So, if
we're getting (say) 30k req/s we're using the cached date 30k
times - big savings since `(new Date()).toUTCString()` is quite
an expensive operation.

This module manually "compiles" the `_http_outgoing` module,
injecting a small piece of code that exports this internal function.

This means, that any time we use `fast-date` we're using the same
cached date (for that second) that the `http` module is using, so 
it's very very low cost when used in an HTTP server under load.

BUT - this is relying on internal code, so fallback to our own 
(still high speed) equivalent implementation if the extraction
mechanism fails.    

## For best results...

Load `fast-date` at the top level, before loading `http`.
This means there will only be `utcDate` function, with one cache.
Otherwise you're creating two caches, with two recurring timeouts.
(Still fast though).

## Customizing the Load Order Warning Message

As a convenience `fast-date` will emit a warning to users if they
include it after loading the http module, a consuming module can 
set `TOP_NAME` to customize the warning message.

For instance if we do:

```js
var http = require('http') // might be express, hapi, koa etc. same thing
var fastDate = require('fast-date')
fastDate.TOP_NAME = 'pino' // imagine that pino is the parent module
```

The warning will be:

```sh
(node:49093) Warning: For best performance, load pino before requiring http(s)
```

## Tests

```sh
npm test
```

## Coverage

```sh
npm run cov 
```

```
-------------|----------|----------|----------|----------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |
-------------|----------|----------|----------|----------|
All files    |      100 |      100 |      100 |      100 |
 fallback.js |      100 |      100 |      100 |      100 |
 index.js    |      100 |      100 |      100 |      100 |
-------------|----------|----------|----------|----------|
```

## More Benchmarks

For effects on an HTTP server:

```sh
npm run bench-http
```

```
===========Benching nativeDate=============
Running 10s test @ http://localhost:59870
10 connections

Stat         Avg     Stdev    Max
Latency (ms) 0.02    0.21     19
Req/Sec      18582.8 1080.63  19135
Bytes/Sec    2.38 MB 127.8 kB 2.49 MB

186k requests in 10s, 23.97 MB read

===========Benching fastDate=============
Running 10s test @ http://localhost:59871
10 connections

Stat         Avg      Stdev    Max
Latency (ms) 0.02     0.12     7
Req/Sec      19103.28 520.99   19647
Bytes/Sec    2.47 MB  84.26 kB 2.62 MB

210k requests in 11s, 27.11 MB read

===========Benching dateNow=============
Running 10s test @ http://localhost:59873
10 connections

Stat         Avg     Stdev  Max
Latency (ms) 0.01    0.11   10
Req/Sec      19269.1 313.15 19631
Bytes/Sec    2.16 MB 0 B    2.23 MB

212k requests in 11s, 23.95 MB read

===========Benching fallback=============
Running 10s test @ http://localhost:59872
10 connections

Stat         Avg      Stdev    Max
Latency (ms) 0.01     0.1      8
Req/Sec      18989.82 250.14   19359
Bytes/Sec    2.44 MB  37.68 kB 2.62 MB

209k requests in 11s, 26.95 MB read
=========== Complete ===========
```

## License

MIT

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)