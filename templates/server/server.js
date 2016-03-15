'use strict';

import Hapi from 'hapi';
import Hoek from 'hoek';
import Inert from 'inert';
import good from 'good';
import goodConsole from 'good-console';
import Promise from 'bluebird';
import path from 'path';

import conf from './conf/environment';

import esInit from './es/init';

// routes
import Api from './api';

// static
import Static from './utils/static';

// initialize Hapi server
const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, '../client')
      }
    }
  }
});

// Promisify server methods
const register = Promise.promisify(server.register, {context: server});
const start = Promise.promisify(server.start, {context: server});

// initialize server connections
server.connection({
  host: conf.host,
  port: conf.port
});

const goodOptions = {
  reporters: [
    {
      reporter: goodConsole,    // Log everything to console
      events: {log: '*', response: '*'}
    }
  ]
};

Promise.all([
  esInit(),
  register(Api, {routes: {prefix: '/api'}}),
  register([Inert, Static, {register: good, options: goodOptions}])
])
  .then(() => {
    // handle API errors
    server.ext('onPreResponse', (request, reply) => {
      const response = request.response;

      if (!response.isBoom)
        return reply.continue();

      var res = {};

      res.code = !isNaN(response.status) ? +response.status : 500;

      if (response.message)
        res.message = response.message || 'Internal server error';

      reply(res).code(res.code);
    });

    return start();
  })
  .then(() => console.log('Server started at: ' + server.info.uri))
  .catch(err => console.error(err.stack))
;

process.on("unhandledRejection", function(reason, promise) {
  throw reason;
});
