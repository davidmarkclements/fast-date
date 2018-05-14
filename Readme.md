# fast-date

[![Build Status](https://travis-ci.org/davidmarkclements/fast-date.svg?branch=master)](https://travis-ci.org/davidmarkclements/fast-date)
[![codecov](https://codecov.io/gh/davidmarkclements/fast-date/branch/master/graph/badge.svg)](https://codecov.io/gh/davidmarkclements/fast-date)


High Speed UTC Timestamps 

## Supports

- [x] Node 6
- [x] Node 8
- [x] Node 10

## Benchmarks

```sh
npm run bench
```

```
NativeDate*100000: 175.776ms
FastDateUnix*100000: 98.684ms
FastDateUtc*100000: 96.166ms
DateNow*100000: 107.326ms
TimerNow*100000: 105.762ms
```

`fast-date` is about as fast at providing UTC timestamps as `Date.now` is at providing millisecond epochs.

## Usage

```js
var fastDate = require('fast-date')()
var http = require('http')

http.createServer(function (req, res) {
  res.end(fastDate())
}).listen(8080)
```

### Options

#### format

Set the output, current options:

* `utc` output a UTC timestamp 
* `unix` output seconds since the unix Epoch

```js
var fastDate = require('fast-date')({format: 'unix'})
```

#### prefix & suffix

Add strings before and after:

```js
var fastDate = require('fast-date')({prefix: 'some text before', suffix: 'some text after'})
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

## License

MIT

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)