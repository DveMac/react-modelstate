var express = require('express');
var browserify = require('connect-browserify');

express()
  .get('/api*', function (req, res, next) {
    res.send(200, [
      { id: 1, name: 'cat' },
      { id: 2, name: 'dog' }
    ]);
  })
  .get('/bundle.js', browserify(__dirname + '/browser-tests.js', {debug: true, watch: true}))
  .use(express.static(__dirname + '/public'))
  .listen(3111, function() {
    console.log('Point your browser to http://localhost:3111');
  });