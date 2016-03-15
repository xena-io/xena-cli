'use strict';

import glob from 'glob';
import path from 'path';
import _ from 'lodash';

const endpoints = glob.sync(path.join(__dirname, '*/index.js'))
  .map(require)
  .map(elt => elt.default)
  .reduce((acc, elt) => acc.concat(elt), [])
;

function Api(server, options, next) {
  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, reply) => reply({code: 404, message: 'Uncaught error: Not Found'}).code(404)
  });
  server.route(endpoints);

  next();
}

Api.attributes = {
  name: 'Api',
  version: '1.0.0'
};

export default Api;
