/*
  latent-proxy.js: Example of proxying over HTTP with latency

  Copyright (c) 2013 - 2016 Charlie Robbins, Jarrett Cruger & the Contributors.

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var util = require('util'),
    colors = require('colors'),
    Transform = require('stream').Transform
    http = require('http'),
    httpProxy = require('../../lib/http-proxy');

//
// Http Proxy Server with transform streams on request and response
// A good candidate would be a throttle stream for example
//
var proxy = httpProxy.createProxyServer();
http.createServer(function (req, res) {
  proxy.web(req, res, {
    target: 'http://localhost:9008',
    reqTransformStream: new Transform({
      transform(chunk, encoding, callback) {
        callback(null, 'Ni! ')
      }
    }),
    resTransformStream: new Transform({
      transform(chunk, encoding, callback) {
        callback(null, 'iki iki iki ')
      }
    })
  });
}).listen(8008);

//
// Target Http Server
//
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Whatever, this will be ovewritten by resTransformStream');
  res.end();
}).listen(9008);

util.puts('http proxy server '.blue + 'started '.green.bold + 'on port '.blue + '8008 '.yellow + 'with transform streams'.magenta.underline);
util.puts('http server '.blue + 'started '.green.bold + 'on port '.blue + '9008 '.yellow);
