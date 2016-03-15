'use strict';

function registerPlugin(server, next) {
  server.ext('onPreResponse', (request, reply) => {
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

  next();
}

function Static(server, options, next) {
  server.dependency('inert', registerPlugin);

  next();
}

Static.attributes = {
  name: 'Static',
  version: '1.0.0',
};

export default Static;
