'use strict';

var _ = require('lodash');

var config = require('./config');
var esInit = require('./elasticsearch/init');
var winston = require('./config/winston');

var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  host: config.host,
  port: config.port,
});

server.route({
 method: 'GET',
 path: '/{param*}',
 handler: {
   directory: {
     path: config.staticDir,
     lookupCompressed: true,
   },
 },
});

esInit()
  .then(function() {
    server.start(function() {
      winston.info('Server started at %s', server.info.uri);
    });
  })
;
