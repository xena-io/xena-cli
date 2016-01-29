'use strict';

var _ = require('lodash');
var path = require('path');

var all = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.NODE_PORT || 3000
};

module.exports = _.extend({}, all, require('./' + conf.env + '.js'));
