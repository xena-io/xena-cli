'use strict';

import _ from 'lodash';
import path from 'path';

const all = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.NODE_PORT || 3000,
  root: path.normalize(__dirname, '/../..'),
};

const environment = require(__dirname + '/' + all.env + '.js').default;
const conf = _.extend({}, all, environment);

export default conf;
