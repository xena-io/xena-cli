#! /usr/bin/env node

var program = require('commander');

var packageJson = require('./package.json');

program
  .version(packageJson.version);

program
  .command('init [name]')
  .alias('i')
  .description('Initialize your XENA application')
  .action(require('./actions/init'));

// program
//   .command('generate')
//   .alias('g')
//   .description('Generate your api based on the mappings files')
//   .action(require('./actions/generate'));

program
  .command('mapping')
  .alias('m')
  .description('Generate a mapping file')
  .action(require('./actions/mapping'));

program.parse(process.argv);
