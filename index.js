#! /usr/bin/env node

var program = require('commander');

var version = require('./package.json').version;

program
  .version(version)
;

require('./actions/init');
require('./actions/mapping');
require('./actions/endpoint');

program.parse(process.argv);
