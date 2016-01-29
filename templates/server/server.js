'use strict';

import Hapi from 'hapi';
import Hoek from 'hoek';
import Inert from 'inert';
import good from 'good';
import goodConsole from 'good-console';

import path from 'path';

// application configuration
import conf from './conf/environment';

// initialization elasticsearch
import esInit from './es/init';

// routes
import api from './api';

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, '../client')
      }
    }
  }
});

server.connection({
  host: conf.host,
  port: conf.port
});

const goodOptions = {
  reporters: [
    {
      reporter: goodConsole,
      events: {log: '*', response: '*'}
    }
  ]
};

esInit()
  .then(() => {
    server.register(
      [
        Inert,
        {
          register: good,
          options: goodOptions
        }
      ], (err) => {
        Hoek.assert(!err, err);

        server.ext('onPreResponse', function(request, reply) {
          const response = request.response;

          if (!response.isBoom || request.route.settings.id !== 'statics') {
            return reply.continue();
          }

          return reply.file('index.html');
        });

        server.route({
          method: 'GET',
          path: '/{param*}',
          handler: {
            directory: {
              path: '.',
              lookupCompressed: true,
              redirectToSlash: false,
            }
          },
          config: {id: 'statics'}
        });

        api(server);

        server.start((err) => {
          Hoek.assert(!err, err);
          console.log('Server started at: ' + server.info.uri);
        });
      }
    );
  })
;
