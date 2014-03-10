var express     = require('express');
var fs          = require('fs');
var browserify  = require('connect-browserify');
var ReactAsync  = require('react-async');
var App         = require('./client');

express()
  .get('/app.js', browserify({ entry: __dirname + '/app.jsx', transforms: ['reactify'], debug: true, watch: true}))
  .get('/bundle.js', browserify({ entry: __dirname + '/client', transforms: ['reactify'], debug: true, watch: true}))
  .get('/server_render', function(req, res, next) {
    ReactAsync.renderComponentToStringWithAsyncState(App(), function(err, markup, data) {
      if (err) return next(err);

      markup = ReactAsync.injectIntoMarkup(markup, data, ['./bundle.js']);
//      fs.writeFileSync('./example/server-dump.html', markup);
      res.send(markup);
    });
  })
  .use(express.static(__dirname + '/public'))
  .listen(3000, function() {
    console.log('Point your browser to http://localhost:3000');
  });
